import {
    Card,
    Label,
    TextInput,
    Button,
    Datepicker
} from "flowbite-react";
import React, { useState, useEffect } from "react";
import type { BasicInfo } from '../../../../shared/types/userProfile';


type Props = {
    data: BasicInfo;
    onChange: (data: BasicInfo) => void;
};

export const BasicInfoCard: React.FC<Props> = ({ data, onChange }) => {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<BasicInfo>(data);

    const handleChange = (field: keyof BasicInfo, value: string) => {
        const updated = { ...formData, [field]: value };
        setFormData(updated);
        onChange(updated);
    };

    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const today = new Date();
    
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
    
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
    
        return age;
    };

    const handleSave = () => {
        setEditMode(false);
    };

    useEffect(() => {
        setFormData(data);
    }, [data]);

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h5 className="text-xl font-bold">Basic Information</h5>
                <Button size="xs" onClick={() => (editMode ? handleSave() : setEditMode(true))}>
                    {editMode ? "Done" : "Edit"}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <TextInput
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) => handleChange("first_name", e.target.value)}
                        disabled={!editMode}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="middle_name">Middle Name</Label>
                    <TextInput
                        id="middle_name"
                        value={formData.middle_name || ""}
                        onChange={(e) => handleChange("middle_name", e.target.value)}
                        disabled={!editMode}
                    />
                </div>

                <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <TextInput
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) => handleChange("last_name", e.target.value)}
                        disabled={!editMode}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Datepicker
                        id="dob"
                        value={formData.dob ? new Date(formData.dob) : undefined}
                        onChange={(date) => handleChange("dob", date ? date.toISOString() : "")}
                        disabled={!editMode}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="age">Age</Label>
                    <TextInput
                        id="age"
                        value={formData.dob ? calculateAge(formData.dob).toString() : ""}
                        disabled
                    />
                </div>
            </div>
        </Card>
    );
};
