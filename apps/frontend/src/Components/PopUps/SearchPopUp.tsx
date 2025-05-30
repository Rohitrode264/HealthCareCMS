import { useRef, useState } from "react";
import { CloseIcon } from "../../Icons/CloseIcon";
import { Button } from "../Inputs/Button";
import { Input } from "../Inputs/Input";
import { BACKEND_URL } from "../../config";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export const Search = ({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) => {
    const doctorId = useParams().DoctorId;
    const phNumber = useRef<HTMLInputElement | null>(null);
    const dateOfBirth = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    const [error, setError] = useState<string>("");

    const searchPatient = async () => {
        setError("");
        const phoneNumber = phNumber.current?.value?.trim();
        const dob = dateOfBirth.current?.value?.trim();

        if (!phoneNumber) {
            setError("Please enter phone number");
            return;
        }
        if (!dob) {
            setError("Please select date of birth");
            return;
        }

         // Clear errors if everything is valid

        try {
            const response = await axios.get(`${BACKEND_URL}cms/v1/doctor/search/${phoneNumber}/${dob}`);
            navigate(`/cms/v1/doctor/search/patientDetails/${doctorId}/${response.data.result._id}`);
        } catch (error) {
            console.error("Wrong patient details:", error);
            setError("Patient Not Found. Please Try Again.");
        }
    };

    return (
        <div>
            {open && (
                <div className="min-h-screen min-w-screen flex inset-0 fixed justify-center items-center z-50">
                    <div className="absolute inset-0 backdrop-blur-xs bg-black/20"></div>
                    <div className="relative bg-white p-10 rounded-2xl">
                        <span onClick={() => setOpen(false)} className="right-0 absolute top-0 p-2 text-gray-400 hover:text-gray-700 duration-300">
                            <CloseIcon size={28.85} />
                        </span>
                        <div className="flex-col justify-center font-bold text-2xl text-gray-400 mb-5">
                            <div className="text-gray-700">Search for Patient</div>
                            <div className="font-medium text-sm italic">
                                Please enter patient's phone number and date of birth to access patient details.
                            </div>
                        </div>
                        <div className="flex">
                            <Input size="large" placeholder="Phone Number" type="number" refrence={phNumber} />
                            <Input size="large" placeholder="" type="date" refrence={dateOfBirth} />
                        </div>
                        <div className="flex justify-center mt-5">
                            <Button title="Search" size="md" variant="secondary" onClick={searchPatient} />
                        </div>
                        {error && <div className="text-red-500 text-center mt-3">{error}</div>}
                    </div>
                </div>
            )}
        </div>
    );
};