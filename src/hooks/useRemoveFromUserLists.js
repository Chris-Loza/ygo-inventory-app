import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { toast } from "react-toastify";

export const useRemoveFromUserLists = async (
  uid,
  selectedCard,
  wishlistToggle,
  cardCount,
  setName
) => {
  const docRef = doc(db, "users", uid);

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const currentInventory = docSnap.data().inventory;
      const currentWishlist = docSnap.data().wishlist;

      if (!wishlistToggle) {
        const cardIndex = currentInventory.findIndex(
          (card) => card.name === selectedCard.name && card.set === setName
        );

        if (cardIndex !== -1) {
          const updatedCard = { ...currentInventory[cardIndex] };
          updatedCard.count -= Number(cardCount);

          if (updatedCard.count < 1) {
            await updateDoc(docRef, {
              inventory: arrayRemove(currentInventory[cardIndex]),
            });
            toast.warning("Card removed from Inventory!");
          } else {
            const updatedInventory = [...currentInventory];
            updatedInventory[cardIndex] = updatedCard;

            await updateDoc(docRef, {
              inventory: updatedInventory,
            });
            toast.info("Card count decreased.");
          }
        }
      } else {
        const cardIndex = currentWishlist.findIndex(
          (card) => card.name === selectedCard.name && card.set === setName
        );

        if (cardIndex !== -1) {
          const updatedCard = { ...currentWishlist[cardIndex] };
          updatedCard.count -= Number(cardCount);

          if (updatedCard.count < 1) {
            await updateDoc(docRef, {
              wishlist: arrayRemove(currentWishlist[cardIndex]),
            });
            toast.warning("Card removed from Wishlist!");
          } else {
            const updatedWishlist = [...currentWishlist];
            updatedWishlist[cardIndex] = updatedCard;

            await updateDoc(docRef, {
              wishlist: updatedWishlist,
            });
            toast.info("Card count decreased.");
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};
