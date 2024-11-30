import {
  Zap,
  Music,
  Trophy,
  Theater,
  Mic2,
  Tent,
  Wrench,
  Wine,
  Lightbulb,
  Film,
  Palette,
  Music2,
  Briefcase,
  Moon,
  Users,
  Heart,
  GraduationCap,
  HeartHandshake,
  Calendar,
  Sparkles,
} from "lucide-react";

export const categories = [
  {
    id: 1,
    name: "For You",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-white",
  },
  {
    id: 2,
    name: "Concerts",
    icon: <Music className="w-6 h-6" />,
    color: "bg-white",
  },
  {
    id: 3,
    name: "Sports",
    icon: <Trophy className="w-6 h-6" />,
    color: "bg-white",
  },
  {
    id: 4,
    name: "Theatre",
    icon: <Theater className="w-6 h-6" />,
    color: "bg-white",
  },
  {
    id: 5,
    name: "Comedy",
    icon: <Mic2 className="w-6 h-6" />,
    color: "bg-white",
  },
  {
    id: 6,
    name: "Festivals",
    icon: <Tent className="w-6 h-6" />,
    color: "bg-white",
  },
  {
    id: 7,
    name: "Workshops",
    icon: <Wrench className="w-6 h-6" />,
    color: "bg-white",
  },
  {
    id: 8,
    name: "Food",
    icon: <Wine className="w-6 h-6" />,
    color: "bg-white",
  },
  {
    id: 9,
    name: "Tech",
    icon: <Lightbulb className="w-6 h-6" />,
    color: "bg-white",
  },
  {
    id: 10,
    name: "Film",
    icon: <Film className="w-6 h-6" />,
    color: "bg-white",
  },
  {
    id: 11,
    name: "Art",
    icon: <Palette className="w-6 h-6" />,
    color: "bg-white",
  },
  {
    id: 12,
    name: "Dance",
    icon: <Music2 className="w-6 h-6" />,
    color: "bg-white",
  },
  {
    id: 13,
    name: "Business",
    icon: <Briefcase className="w-6 h-6" />,
    color: "bg-white",
  },
  {
    id: 14,
    name: "Nightlife",
    icon: <Moon className="w-6 h-6" />,
    color: "bg-white",
  },
  {
    id: 15,
    name: "Family",
    icon: <Users className="w-6 h-6" />,
    color: "bg-white",
  },
  {
    id: 16,
    name: "Health",
    icon: <Heart className="w-6 h-6" />,
    color: "bg-white",
  },
  {
    id: 17,
    name: "Education",
    icon: <GraduationCap className="w-6 h-6" />,
    color: "bg-white",
  },
  {
    id: 18,
    name: "Charity",
    icon: <HeartHandshake className="w-6 h-6" />,
    color: "bg-white",
  },
  {
    id: 19,
    name: "Holiday",
    icon: <Calendar className="w-6 h-6" />,
    color: "bg-white",
  },
  {
    id: 20,
    name: "Pop-ups",
    icon: <Sparkles className="w-6 h-6" />,
    color: "bg-white",
  },
];

export const getCategoryById = (categoryId) => {
  return categories.find((category) => category.id === categoryId) || null;
};

// Get category by name
export const getCategoryByName = (categoryName) => {
  return categories.find((category) => category.name === categoryName) || null;
};

// Get category color by ID
export const getCategoryColorById = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category ? category.color : null;
};

// Get category icon by ID
export const getCategoryIconById = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category ? category.icon : null;
};

// Check if category exists
export const categoryExists = (categoryId) => {
  return categories.some((category) => category.id === categoryId);
};
