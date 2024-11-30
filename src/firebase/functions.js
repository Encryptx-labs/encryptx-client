import { db } from "./config";
import { createHash } from 'crypto';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

// Function to add a new event
export const addEvent = async (address, eventData) => {
  try {
    const timestamp = new Date();
    const event = {
      ...eventData,
      createdAt: timestamp,
      creatorAddress: address,
      id: generateEventId(),
      status: "active"
    };

    const eventsRef = doc(collection(db, "events"), event.id);
    await setDoc(eventsRef, event);

    return {
      success: true,
      message: "Event added successfully",
      data: event
    };
  } catch (error) {
    console.error("Error adding event: ", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Function to get all events
export const getAllEvents = async () => {
  try {
    const eventsCollection = collection(db, "events");
    const snapshot = await getDocs(eventsCollection);
    
    const events = [];
    snapshot.forEach(doc => {
      events.push(doc.data());
    });

    // Sort by date (newest first)
    events.sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      success: true,
      data: events
    };
  } catch (error) {
    console.error("Error getting events: ", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Function to get events by address
export const getEventsByAddress = async (address) => {
  try {
    const eventsCollection = collection(db, "events");
    const snapshot = await getDocs(eventsCollection);
    
    const events = [];
    snapshot.forEach(doc => {
      const event = doc.data();
      if (event.creatorAddress === address) {
        events.push(event);
      }
    });

    // Sort by date (newest first)
    events.sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      success: true,
      data: events
    };
  } catch (error) {
    console.error("Error getting events by address: ", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Function to get event by ID
export const getEventById = async (eventId) => {
  try {
    const eventRef = doc(collection(db, "events"), eventId);
    const eventDoc = await getDoc(eventRef);

    if (!eventDoc.exists()) {
      return {
        success: false,
        error: "Event not found"
      };
    }

    return {
      success: true,
      data: eventDoc.data()
    };
  } catch (error) {
    console.error("Error getting event by ID: ", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Function to update an event
export const updateEvent = async (eventId, updateData) => {
  try {
    const eventRef = doc(collection(db, "events"), eventId);
    const eventDoc = await getDoc(eventRef);

    if (!eventDoc.exists()) {
      return {
        success: false,
        error: "Event not found"
      };
    }

    const updatedEvent = {
      ...eventDoc.data(),
      ...updateData,
      updatedAt: new Date()
    };

    await setDoc(eventRef, updatedEvent);

    return {
      success: true,
      message: "Event updated successfully",
      data: updatedEvent
    };
  } catch (error) {
    console.error("Error updating event: ", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Helper function to generate event ID
function generateEventId() {
  return 'evt_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function createSignatureHash(signature) {
  return createHash('sha256')
    .update(signature)
    .digest('hex');
}

// Store signature data in Firebase
async function storeSignatureData(signature, value, address) {
  try {
    const signatureHash = createSignatureHash(signature);
    
    // Create data object
    const signatureData = {
      signature,
      value,
      address,
      timestamp: new Date().toISOString()
    };

    // Reference to the document with hash as ID
    const signatureRef = doc(db, 'signatures', signatureHash);
    
    // Check if document already exists
    const docSnap = await getDoc(signatureRef);
    
    if (docSnap.exists()) {
      // Update existing document
      await setDoc(signatureRef, signatureData, { merge: true });
      console.log('Signature data updated successfully');
    } else {
      // Create new document
      await setDoc(signatureRef, signatureData);
      console.log('Signature data stored successfully');
    }
    
    return signatureHash;
  } catch (error) {
    console.error('Error storing signature data:', error);
    throw error;
  }
}

// Retrieve signature data using hash
async function getSignatureByHash(signatureHash) {
  try {
    const signatureRef = doc(db, 'signatures', signatureHash);
    const docSnap = await getDoc(signatureRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log('No signature found with this hash');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving signature data:', error);
    throw error;
  }
}

// Modified signMessage function to integrate with Firebase
async function signMessage(signer) {
  try {
    // Get signature and address
    const signature = await signer._signTypedData(domain, types, value);
    const address = await signer.getAddress();
    
    // Store in Firebase and get hash
    const hash = await storeSignatureData(signature, value, address);
    
    console.log("Signature:", signature);
    console.log("Address:", address);
    console.log("Hash:", hash);
    
    return { signature, value, address, hash };
  } catch (error) {
    console.error('Error in signMessage:', error);
    throw error;
  }
}

export {
  signMessage,
  getSignatureByHash,
  createSignatureHash,
  storeSignatureData
};