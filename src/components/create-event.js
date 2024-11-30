"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { ethers } from "ethers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  X,
  Users,
  Clock,
  CalendarIcon,
  MapPin,
  DollarSign,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { add, format } from "date-fns";
import { toast } from "sonner";
import { categories, getCategoryById } from "@/utils/categories";
import {
  addEvent,
  getAllEvents,
  getEventsByAddress,
} from "@/firebase/functions";
import { useEvents } from "@/context/event-context";
import {
  LINEA_SEPOLIA_ABI,
  LINEA_SEPOLIA_MAILBOX,
  CONTRACTBYTECODE,
  INCO_ADDRESS,
  USDCADDRESS,
} from "@/utils/contracts";
import { useWalletContext } from "@/privy/walletContext";
import { ensureFunding } from "@/utils/fundingHelper";

const CreateEventSheet = ({ isOpen, onOpenChange }) => {
  const { address } = useWalletContext();
  console.log(address);
  const initialEventData = {
    title: "",
    description: "",
    duration: "30",
    price: "1",
    date: new Date(),
    time: "10:00",
    location: "",
    category: 2,
    maxParticipants: "4",
    image: null,
    imagePreview: null,
  };
  const [isImageUploading, setIsImageUploading] = React.useState(false);
  const fileInputRef = React.useRef(null);
  const [eventData, setEventData] = React.useState(initialEventData);
  const { refreshEvents } = useEvents();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { signer } = useWalletContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fundingResult = await ensureFunding(
      address, // address to fund
      "linea", // network
      "0.1", // required balance
      "0.1" // funding amount
    );

    if (!fundingResult.success) {
      console.error("Funding failed:", fundingResult.message);
      return;
    }

    try {
      // Create contract factory
      const factory = new ethers.ContractFactory(
        LINEA_SEPOLIA_ABI,
        CONTRACTBYTECODE,
        signer // Make sure you have a valid signer instance
      );

      // Deploy contract with constructor arguments
      const contract = await factory.deploy(
        USDCADDRESS,
        LINEA_SEPOLIA_MAILBOX,
        ethers.parseEther("100"),
        INCO_ADDRESS,
        ethers.parseEther("20")
      );

      // Wait for deployment to complete
      const deploymentReceipt = await contract.deploymentTransaction();
      const tx = await deploymentReceipt.getTransaction();
      
      console.log("Contract deployed successfully!");
      console.log("Transaction hash:", deploymentReceipt.hash);
      console.log("Contract address:", await contract.getAddress());

      const eventDataForDB ={
        title: eventData.title,
        description: eventData.description,
        duration: eventData.duration,
        price: eventData.price,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        category: eventData.category,
        maxParticipants: eventData.maxParticipants,
        image: eventData.imageUrl,
      };
     
      const result = await addEvent(address, eventDataForDB);
      if (result.success) {
        await tx.wait();
        toast.success("Event contract deployed!", {
          description: `Contract deployed at: ${(
            await contract.getAddress()
          )?.slice(0, 6)}...${(await contract.getAddress())?.slice(-4)}`,
        });
        await refreshEvents();
        setEventData(initialEventData);
        onOpenChange(false);
      } else {
        toast.error("Failed to save event details", {
          description:
            result.error || "Contract deployed but failed to save details",
        });
      }
    } catch (error) {
      console.error("Error deploying contract:", error);
      toast.error("Failed to deploy contract", {
        description: error.message || "Unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setEventData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic file validation
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type", {
        description: "Please upload a JPEG, PNG, or GIF image.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Please upload an image smaller than 5MB.",
      });
      return;
    }

    setIsImageUploading(true);

    const uploadPromise = new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME
        );
        formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Upload failed: ${errorData.error?.message || "Unknown error"}`
          );
        }

        const data = await response.json();

        setEventData((prev) => ({
          ...prev,
          image: file,
          imageUrl: data.secure_url,
        }));

        resolve();
      } catch (error) {
        console.error("Error uploading image:", error);
        reject(error);
      } finally {
        setIsImageUploading(false);
      }
    });

    toast.promise(uploadPromise, {
      loading: "Uploading image...",
      success: "Image uploaded successfully",
      error: (err) => `Upload failed: ${err.message || "Unknown error"}`,
    });
  };

  const handleImageRemove = () => {
    setEventData((prev) => ({
      ...prev,
      image: null,
      imageUrl: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success("Image removed");
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create New Event</SheetTitle>
          <SheetDescription>
            Fill in the details below to create your event.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Preview Card */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="relative w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  {isImageUploading ? (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 text-white animate-spin" />
                    </div>
                  ) : eventData.imageUrl ? (
                    <>
                      <img
                        src={eventData.imageUrl}
                        alt="Event preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={handleImageRemove}
                        className="absolute top-1 right-1 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </>
                  ) : (
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {eventData.title || "Event Title"}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Clock className="h-4 w-4" />
                    <span>{eventData.duration} min</span>
                    <span className="font-bold">
                      ${Number(eventData.price).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">Jennifer</span>
                    <Badge className={`ml-auto`}>
                      {getCategoryById(eventData.category).name}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Title Field */}
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={eventData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Exciting Hot Air Balloon Ride"
              />
            </div>

            {/* Description Field */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={eventData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe your event..."
                className="h-32"
              />
            </div>

            {/* Date and Time Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal overflow-hidden"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {eventData.date ? (
                        format(eventData.date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={eventData.date}
                      onSelect={(date) => handleChange("date", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="time">Time</Label>
                <Select
                  value={eventData.time}
                  onValueChange={(value) => handleChange("time", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }).map((_, i) => (
                      <SelectItem
                        key={i}
                        value={`${String(i).padStart(2, "0")}:00`}
                      >
                        {`${String(i).padStart(2, "0")}:00`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location Field */}
            <div>
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="location"
                  value={eventData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="Event location"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Duration and Price Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="duration"
                    type="number"
                    value={eventData.duration}
                    onChange={(e) => handleChange("duration", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="price">Price ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={eventData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Maximum Participants Field */}
            <div>
              <Label htmlFor="maxParticipants">Maximum Participants</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="maxParticipants"
                  type="number"
                  value={eventData.maxParticipants}
                  onChange={(e) =>
                    handleChange("maxParticipants", e.target.value)
                  }
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Field */}
            <div>
              <Label>Category</Label>
              <Select
                defaultValue={eventData.category}
                onValueChange={(value) => handleChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        {category.icon}
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image Upload Field */}
            <div>
              <Label htmlFor="image">Event Image</Label>
              <Input
                id="image"
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isImageUploading}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </SheetClose>
          <Button type="submit" disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? "Creating..." : "Create Event"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CreateEventSheet;
