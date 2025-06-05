import {
    Card,
    Label,
    TextInput,
    Button,
    Datepicker,
} from "flowbite-react";
import { useState, useEffect } from "react";
import type { Employment } from '../../../../shared/types/userProfile';

type Props = {
    data: Employment[];
    onChange: (list: Employment[]) => void;
    readOnly?: boolean;
};

export const EmploymentCard: React.FC<Props> = ({ data, onChange, readOnly = false }) => {
    const [jobs, setJobs] = useState<Employment[]>([]);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        setJobs(data);
    }, [data]);

    const updateField = (
        index: number,
        field: keyof Employment,
        value: string
    ) => {
        const updated = [...jobs];
        updated[index][field] = value;
        setJobs(updated);
        onChange(updated);
    };

    const handleDateChange = (index: number, field: "from_date" | "to_date", date: Date) => {
        const formatted = date.toISOString().split("T")[0];
        updateField(index, field, formatted);
    };

    const handleAdd = () => {
        const newJob: Employment = {
            company_name: "",
            from_date: "",
            to_date: "",
        };
        const updated = [...jobs, newJob];
        setJobs(updated);
        onChange(updated);
    };

    const handleRemove = (index: number) => {
        const updated = jobs.filter((_, i) => i !== index);
        setJobs(updated);
        onChange(updated);
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h5 className="text-xl font-semibold">Occupations</h5>
                {!readOnly && (
                    <Button size="xs" onClick={() => setEditMode(!editMode)}>
                        {editMode ? "Done" : "Edit"}
                    </Button>
                )}
            </div>

            {jobs.map((job, index) => (
                <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 border-b pb-4 items-end"
                >
                    <div>
                        <Label>Occupation</Label>
                        <TextInput
                            value={job.company_name}
                            onChange={(e) =>
                                updateField(index, "company_name", e.target.value)
                            }
                            disabled={!editMode || readOnly}
                            required
                        />
                    </div>

                    <div>
                        <Label>From Date</Label>
                        <Datepicker
                            value={job.from_date ? new Date(job.from_date) : undefined}
                            onChange={(date) =>
                                handleDateChange(index, "from_date", date as Date)
                            }
                            disabled={!editMode || readOnly}
                        />
                    </div>

                    <div>
                        <Label>To Date</Label>
                        <Datepicker
                            value={job.to_date ? new Date(job.to_date) : undefined}
                            onChange={(date) =>
                                handleDateChange(index, "to_date", date as Date)
                            }
                            disabled={!editMode || readOnly}
                        />
                    </div>

                    {editMode && !readOnly && (
                        <div>
                            <Button
                                size="xs"
                                color="failure"
                                onClick={() => handleRemove(index)}
                            >
                                Remove
                            </Button>
                        </div>
                    )}
                </div>
            ))}

            {editMode && !readOnly && (
                <div className="flex justify-start">
                    <Button onClick={handleAdd} size="sm">
                        Add Employment
                    </Button>
                </div>
            )}
        </Card>
    );
};
