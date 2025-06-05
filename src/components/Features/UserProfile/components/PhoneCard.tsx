import { Card, Label, TextInput, Select, Button } from "flowbite-react";
import { useState, useEffect } from "react";
import type { Contact } from '../../../../shared/types/userProfile';

type Props = {
  data: Contact[];
  onChange: (contacts: Contact[]) => void;
};

export const PhoneCard: React.FC<Props> = ({ data, onChange }) => {
  const [phones, setPhones] = useState<Contact[]>(data);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setPhones(data);
  }, [data]);

  const handleChange = (
    index: number,
    field: keyof Contact,
    value: string | boolean
  ) => {
    const updated = [...phones];
    if (field === "preferred") {
      // Update preferred status.
      updated.forEach((e, i) => {
        e.preferred = i === index && value === "true";
      });
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    updated[index] = { ...updated[index], [field]: value };
    setPhones(updated);
    onChange(updated);
  };

  const handleAdd = () => {
    const newPhone: Contact = {
      type: "phone",
      value: "",
      subtype: "personal",
      preferred: false,
    };
    const updated = [...phones, newPhone];
    setPhones(updated);
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const updated = phones.filter((_, i) => i !== index);
    setPhones(updated);
    onChange(updated);
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-xl font-semibold">Phones</h5>
        <Button size="xs" onClick={() => setEditMode(!editMode)}>
          {editMode ? "Done" : "Edit"}
        </Button>
      </div>

      {phones.map((phone, idx) => (
        <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end mb-4 border-b pb-4">
          <div>
            <Label>Phone</Label>
            <TextInput
              type="text"
              value={phone.value}
              onChange={(e) => handleChange(idx, "value", e.target.value)}
              disabled={!editMode}
              required
            />
          </div>

          <div>
            <Label>Subtype</Label>
            <Select
              value={phone.subtype}
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
              value={String(phone.preferred)}
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
            Add Phone
          </Button>
        </div>
      )}
    </Card>
  );
};
