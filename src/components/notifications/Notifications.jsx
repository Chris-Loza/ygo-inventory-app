import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notifications = () => {
  return (
    <div>
      <ToastContainer
        position="bottom-center"
        autoClose={2500}
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        limit={2}
      />
    </div>
  );
};

export default Notifications;
