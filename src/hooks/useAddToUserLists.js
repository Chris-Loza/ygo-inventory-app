import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { toast } from "react-toastify";

export const useAddToUserLists = async (uid, newCard, wishlistToggle) => {
  const docRef = doc(db, "users", uid);

  try {
    const docSnap = await getDoc(docRef);
    // console.log(newCard);
    if (docSnap.exists()) {
      const currentInventory = docSnap.data().inventory;
      const currentWishlist = docSnap.data().wishlist;

      if (!wishlistToggle) {
        const cardIndex = currentInventory.findIndex(
          (card) => card.name === newCard.name && card.set === newCard.set
        );

        if (cardIndex !== -1) {
          currentInventory[cardIndex].count += Number(newCard.count);
          toast.info("Card count increased.");
        } else {
          currentInventory.push(newCard);
          toast.success("Card added to Inventory!");
        }

        await updateDoc(docRef, {
          inventory: currentInventory,
        });
      } else {
        const cardIndex = currentWishlist.findIndex(
          (card) => card.name === newCard.name && card.set === newCard.set
        );

        if (cardIndex !== -1) {
          currentWishlist[cardIndex].count += Number(newCard.count);
          toast.info("Card count increased.");
        } else {
          currentWishlist.push(newCard);
          toast.success("Card added to Wishlist!");
        }

        await updateDoc(docRef, {
          wishlist: currentWishlist,
        });
      }
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};
