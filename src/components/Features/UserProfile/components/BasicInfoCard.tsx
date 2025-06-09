import {
    Card,
    Label,
    TextInput,
    Button,
    Datepicker
} from "flowbite-react";
import React, { useState, useEffect } from "react";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import type { BasicInfo } from '../../../../shared/types/userProfile';
import { toLocalDateString, calculateAge } from "../../../../utils/date";


type Props = {
    data: BasicInfo;
    onChange: (data: BasicInfo) => void;
};

const basicInfoSchema: yup.ObjectSchema<BasicInfo> = yup
    .object({
        first_name: yup.string().required("First name is required"),
        middle_name: yup.string().optional(),
        last_name: yup.string().required("Last name is required"),
        dob: yup
            .string()
            .required("Date of birth is required")
            .test("is-date", "Invalid date", (v) => !isNaN(Date.parse(v || "")))
            .test("min-age", "You must be at least 18", (v) => calculateAge(v || "") >= 18),
        age: yup.number().required(),
    })
    .required()
    .strict(true);

export const BasicInfoCard: React.FC<Props> = ({ data, onChange }) => {
    const [editMode, setEditMode] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<BasicInfo>({
        defaultValues: {
            ...data,
            middle_name: data.middle_name ?? "",
            age: calculateAge(data.dob),
        },
        resolver: yupResolver(basicInfoSchema),
    });


    const onSubmit = (values: BasicInfo) => {
        const updatedValues = {
            ...values,
            age: calculateAge(values.dob),
        }
        onChange(updatedValues);
        setEditMode(false);
    };

    const dobValue = watch("dob");

    useEffect(() => {
        reset(data);
    }, [data, reset]);


    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h5 className="text-xl font-bold">Basic Information</h5>
                <Button size="xs" onClick={editMode ? handleSubmit(onSubmit) : () => setEditMode(true)}>
                    {editMode ? "Save" : "Edit"}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <TextInput {...register("first_name")} disabled={!editMode} />
                    {errors.first_name && (
                        <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="middle_name">Middle Name</Label>
                    <TextInput {...register("middle_name")} disabled={!editMode} />
                </div>

                <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <TextInput {...register("last_name")} disabled={!editMode} />
                    {errors.last_name && (
                        <p className="text-red-500 text-sm">{errors.last_name.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Controller
                        control={control}
                        name="dob"
                        render={({ field }) => (
                            <Datepicker
                                {...field}
                                value={field.value ? new Date(field.value) : null}
                                onChange={(date) =>
                                    field.onChange(date ? toLocalDateString(date) : "")
                                }
                                disabled={!editMode}
                            />
                        )}
                    />
                    {errors.dob && (
                        <p className="text-red-500 text-sm">{errors.dob.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="age">Age</Label>
                    <TextInput disabled value={calculateAge(dobValue).toString()} />
                </div>
            </div>
        </Card>
    );
};
