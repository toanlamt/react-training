import {
    Card,
    Label,
    TextInput,
    Button,
    Datepicker,
    HR
} from "flowbite-react";
import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { Employment } from '../../../../shared/types/userProfile';
import { toLocalDateString, fromDateString } from "../../../../utils/date";

type Props = {
    data: Employment[];
    onChange: (list: Employment[]) => void;
    readOnly?: boolean;
};


const employmentSchema = yup.object({
    company_name: yup.string().required("Company name is required"),
    from_date: yup
        .string()
        .required("Start date is required")
        .test("is-date", "Invalid date", (v) => !isNaN(Date.parse(v || ""))),
    to_date: yup
        .string()
        .nullable()
        .test("is-date", "Invalid date", (v) => !v || !isNaN(Date.parse(v))),
});

const employmentListSchema = yup.object({
    employments: yup.array().of(employmentSchema).required("Employment are required"),
});

export const EmploymentCard: React.FC<Props> = ({ data, onChange, readOnly = false }) => {
    const [editMode, setEditMode] = useState(false);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<{ employments: Employment[] }>({
        defaultValues: { employments: data },
        resolver: yupResolver(employmentListSchema),
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "employments",
    });

    const onSubmit = (values: { employments: Employment[] }) => {
        const filtered = values.employments.filter((e) => e.company_name);
        onChange(filtered);
        setEditMode(false);
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h5 className="text-xl font-semibold">Occupations</h5>
                {!readOnly && (
                    <Button size="xs" onClick={editMode ? handleSubmit(onSubmit) : () => setEditMode(true)}>
                        {editMode ? "Save" : "Edit"}
                    </Button>
                )}
            </div>

            {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <Label>Company Name</Label>
                        <TextInput {...register(`employments.${index}.company_name`)} disabled={!editMode} />
                        {errors.employments?.[index]?.company_name && (
                            <p className="text-red-500 text-sm">{errors.employments[index]?.company_name?.message}</p>
                        )}
                    </div>

                    <div>
                        <Label>From Date</Label>
                        <Controller
                            control={control}
                            name={`employments.${index}.from_date`}
                            render={({ field }) => (
                                <Datepicker
                                    value={field.value ? fromDateString(field.value) : undefined}
                                    onChange={(date) => field.onChange(date ? toLocalDateString(date) : "")}
                                    disabled={!editMode} />
                            )} />
                        {errors.employments?.[index]?.from_date && (
                            <p className="text-red-500 text-sm">{errors.employments[index]?.from_date?.message}</p>
                        )}
                    </div>

                    <div>
                        <Label>To Date</Label>
                        <Controller
                            control={control}
                            name={`employments.${index}.to_date`}
                            render={({ field }) => (
                                <Datepicker
                                    value={field.value ? fromDateString(field.value) : undefined}
                                    onChange={(date) => field.onChange(date ? toLocalDateString(date) : "")}
                                    disabled={!editMode} />
                            )} />
                        {errors.employments?.[index]?.to_date && (
                            <p className="text-red-500 text-sm">{errors.employments[index]?.to_date?.message}</p>
                        )}
                    </div>

                    {editMode && !readOnly && (
                        <div>
                            <Button color="failure" size="xs" onClick={() => remove(index)}>
                                Remove
                            </Button>
                        </div>
                    )}
                    {index < fields.length - 1 && (
                        <div className="col-span-full">
                            <HR />
                        </div>
                    )}
                </div>
            ))}

            {editMode && !readOnly && (
                <div className="flex justify-start">
                    <Button
                        size="sm"
                        onClick={() =>
                            append({
                                company_name: "",
                                from_date: "",
                                to_date: "",
                            })
                        }
                    >
                        Add Employment
                    </Button>
                </div>
            )
            }
        </Card >
    );
};
