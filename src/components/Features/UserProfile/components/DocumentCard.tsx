import {
    Card,
    Label,
    FileInput,
    Button,
    Datepicker,
    TextInput,
    Select,
    HR
} from "flowbite-react";
import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { Document, DocType } from '../../../../shared/types/userProfile';
import { toLocalDateString, fromDateString } from "../../../../utils/date";

type Props = {
    data: Document[];
    onChange: (docs: Document[]) => void;
    readOnly?: boolean;
};

const documentSchema = yup.object({
    doc_type: yup.mixed<DocType>().oneOf(["passport", "id_card", "driver_license"]).required(),
    file_path: yup.string().required("File is required"),
    expiry_date: yup
        .string()
        .required("Expiry date is required")
        .test("is-date", "Invalid date", (v) => !isNaN(Date.parse(v || ""))),
});

const documentListSchema = yup.object({
    documents: yup.array().of(documentSchema).min(1, "At least one document is required").defined()
});

const DOC_TYPE_OPTIONS: Document["doc_type"][] = [
    "passport",
    "id_card",
    "driver_license",
];

export const DocumentCard: React.FC<Props> = ({ data, onChange, readOnly }) => {
    const [editMode, setEditMode] = useState(false);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<{ documents: Document[] }>({
        defaultValues: { documents: data },
        resolver: yupResolver(documentListSchema),
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "documents",
    });

    const documents = watch("documents");

    useEffect(() => {
        reset({ documents: data });
    }, [data, reset]);

    const onSubmit = (values: { documents: Document[] }) => {
        const filtered = values.documents.filter((d) => d.doc_type && d.file_path);
        onChange(filtered);
        setEditMode(false);
    };

    const handleFileChange = (file: File | null, index: number) => {
        if (file) {
            const url = URL.createObjectURL(file);
            setValue(`documents.${index}.file_path`, url);
        }
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h5 className="text-xl font-semibold">Documents</h5>
                {!readOnly && (
                    <Button size="xs" onClick={editMode ? handleSubmit(onSubmit) : () => setEditMode(true)}>
                        {editMode ? "Save" : "Edit"}
                    </Button>
                )}
            </div>

            {fields.map((field, index) => (
                <><div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 pb-4 items-end">
                    <div>
                        <Label>Document Type</Label>
                        <Select {...register(`documents.${index}.doc_type`)} disabled={!editMode}>
                            {DOC_TYPE_OPTIONS.map((type) => (
                                <option key={type} value={type}>
                                    {type.replace("_", " ").toUpperCase()}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div>
                        <Label>Expiry Date</Label>
                        <Controller
                            control={control}
                            name={`documents.${index}.expiry_date`}
                            render={({ field }) => (
                                <Datepicker
                                    value={field.value ? fromDateString(field.value) : undefined}
                                    onChange={(date) => field.onChange(date ? toLocalDateString(date) : "")}
                                    disabled={!editMode} />
                            )} />
                        {errors.documents?.[index]?.expiry_date && (
                            <p className="text-red-500 text-sm">{errors.documents[index]?.expiry_date?.message}</p>
                        )}
                    </div>

                    <div>
                        <Label>File</Label>
                        {editMode ? (
                            <FileInput onChange={(e) => handleFileChange(e.target.files?.[0] || null, index)} />
                        ) : (
                            <TextInput disabled value={field.file_path} />
                        )}
                        {errors.documents?.[index]?.file_path && (
                            <p className="text-red-500 text-sm">{errors.documents[index]?.file_path?.message}</p>
                        )}
                    </div>


                    {editMode && documents.length > 1 && (
                        <div>
                            <Button color="failure" size="xs" onClick={() => remove(index)}>
                                Remove
                            </Button>
                        </div>
                    )}
                </div>{index < fields.length - 1 && <HR />}</>
            ))}

            {errors.documents && typeof errors.documents.message === "string" && (
                <p className="text-red-500 text-sm mb-2">{errors.documents.message}</p>
            )}

            {editMode && !readOnly && (
                <div className="flex justify-start">
                    <Button
                        size="sm"
                        onClick={() =>
                            append({
                                doc_type: "passport",
                                expiry_date: "",
                                file_path: "",
                            })
                        }
                    >
                        Add Identification Document
                    </Button>
                </div>
            )}
        </Card>
    );
};
