import { Bell } from "lucide-react";

function NotificationToast() {

    return(

        <div className="fixed bottom-6 right-6 bg-indigo-600 text-white rounded-xl shadow-xl px-6 py-4 flex gap-3">

            <Bell/>

            <div>

                <h4 className="font-semibold">

                    Live Update

                </h4>

                <p className="text-sm">

                    AI detected a new crowd surge.

                </p>

            </div>

        </div>

    );

}

export default NotificationToast;