import { Card, Label, TextInput, Select, Button } from "flowbite-react";
import { useState, useEffect } from "react";
import type { Contact } from '../../../../shared/types/userProfile';

type Props = {
  data: Contact[];
  onChange: (contacts: Contact[]) => void;
};

export const EmailCard: React.FC<Props> = ({ data, onChange }) => {
  const [emails, setEmails] = useState<Contact[]>(data);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setEmails(data);
  }, [data]);

  const handleChange = (
    index: number,
    field: keyof Contact,
    value: string | boolean
  ) => {
    const updated = [...emails];
    if (field === "preferred") {
      // Update preferred status.
      updated.forEach((e, i) => {
        e.preferred = i === index && value === "true";
      });
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
   
    setEmails(updated);
    onChange(updated);
  };

  const handleAdd = () => {
    const newEmail: Contact = {
      type: "email",
      value: "",
      subtype: "personal",
      preferred: false,
    };
    const updated = [...emails, newEmail];
    setEmails(updated);
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const updated = emails.filter((_, i) => i !== index);
    if (!updated.some((e) => e.preferred) && updated.length > 0) {
      updated[0].preferred = true;
    }
    setEmails(updated);
    onChange(updated);
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-xl font-semibold">Emails</h5>
        <Button size="xs" onClick={() => setEditMode(!editMode)}>
          {editMode ? "Done" : "Edit"}
        </Button>
      </div>

      {emails.map((email, idx) => (
        <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end mb-4 border-b pb-4">
          <div>
            <Label>Email</Label>
            <TextInput
              type="email"
              value={email.value}
              onChange={(e) => handleChange(idx, "value", e.target.value)}
              disabled={!editMode}
              required
            />
          </div>

          <div>
            <Label>Subtype</Label>
            <Select
              value={email.subtype}
              onChange={(e) => handleChange(idx, "subtype", e.target.value)}
              disabled={!editMode}
            >
              <option value="work">Work</option>
              <option value="personal">Personal</option>
            </Select>
          </div>


          <div>
            <Label>Preferred</Label>
            <Select
              value={String(email.preferred)}
              onChange={(e) => handleChange(idx, "preferred", e.target.value)}
              disabled={!editMode}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </Select>
          </div>

          {editMode && (
            <div>
              <Button color="failure" size="xs" onClick={() => handleRemove(idx)}>
                Remove
              </Button>
            </div>
          )}
        </div>
      ))}

      {editMode && (
        <div className="flex justify-start">
          <Button onClick={handleAdd} size="sm">
            Add Email
          </Button>
        </div>
      )}
    </Card>
  );
};