import {
    Card,
    Label,
    FileInput,
    Button,
    Datepicker,
    Select
} from "flowbite-react";
import { useState, useEffect } from "react";
import type { Document } from '../../../../shared/types/userProfile';

type Props = {
    data: Document[];
    onChange: (docs: Document[]) => void;
};

const DOC_TYPE_OPTIONS: Document["doc_type"][] = [
    "passport",
    "id_card",
    "driver_license",
];

export const DocumentCard: React.FC<Props> = ({ data, onChange }) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        setDocuments(data);
    }, [data]);

    const handleFieldChange = (
        index: number,
        field: keyof Document,
        value: string
    ) => {
        const updated = [...documents];
        if (field === "doc_type" && DOC_TYPE_OPTIONS.includes(value as Document["doc_type"])) {
            updated[index][field] = value as Document["doc_type"];
        } else {
            updated[index] = { ...updated[index], [field]: value };
        }
        setDocuments(updated);
        onChange(updated);
    };

    const handleFileChange = (index: number, file: File | null) => {
        if (!file) return;
        const url = URL.createObjectURL(file);
        handleFieldChange(index, "file_path", url);
    };

    const handleAdd = () => {
        const remainingTypes = DOC_TYPE_OPTIONS.filter(
            (type) => !documents.some((doc) => doc.doc_type === type)
        );
        if (remainingTypes.length === 0) return;

        const newDoc: Document = {
            doc_type: remainingTypes[0],
            expiry_date: "",
            file_path: "",
        };

        const updated = [...documents, newDoc];
        setDocuments(updated);
        onChange(updated);
    };

    const handleRemove = (index: number) => {
        const updated = documents.filter((_, i) => i !== index);
        setDocuments(updated);
        onChange(updated);
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h5 className="text-xl font-semibold">Documents</h5>
                <Button size="xs" onClick={() => setEditMode(!editMode)}>
                    {editMode ? "Done" : "Edit"}
                </Button>
            </div>

            {documents.map((doc, index) => (
                <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 border-b pb-4 items-end"
                >
                    <div>
                        <Label>Document Type</Label>
                        <Select
                            value={doc.doc_type}
                            onChange={(e) => handleFieldChange(index, "doc_type", e.target.value)}
                            disabled={!editMode}
                        >
                            {DOC_TYPE_OPTIONS.map((type) => (
                                <option key={type} value={type}>
                                    {type.replace("_", " ").toUpperCase()}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div>
                        <Label>Expiry Date</Label>
                        <Datepicker
                            value={doc.expiry_date ? new Date(doc.expiry_date) : undefined}
                            onChange={(date) =>
                                handleFieldChange(index, "expiry_date", date?.toISOString().split("T")[0] || "")
                            }
                            disabled={!editMode}
                        />
                    </div>

                    <div>
                        <Label>Update Document</Label>
                        <FileInput
                            onChange={(e) =>
                                handleFileChange(index, e.target.files?.[0] || null)
                            }
                            disabled={!editMode}
                        />
                    </div>

                    {editMode && (
                        <div>
                            <Button
                                color="failure"
                                size="xs"
                                onClick={() => handleRemove(index)}
                            >
                                Remove
                            </Button>
                        </div>
                    )}
                </div>
            ))}

            {editMode && documents.length < DOC_TYPE_OPTIONS.length && (
                <div className="flex justify-start">
                    <Button onClick={handleAdd} size="sm">
                        Add Identification Document
                    </Button>
                </div>
            )}
        </Card>
    );
};
