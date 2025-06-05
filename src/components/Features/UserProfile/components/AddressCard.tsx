import { Card, Label, TextInput, Select, Button } from "flowbite-react";
import React, { useState, useEffect } from "react";
import type { Address, AddressType } from '../../../../shared/types/userProfile';

type Props = {
  data: Address[];
  onChange: (addresses: Address[]) => void;
};

const types: AddressType[] = ['mailing', 'work'];


export const AddressCard: React.FC<Props> = ({ data, onChange }) => {
  const [addresses, setAddresses] = useState<Address[]>(data);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setAddresses(data);
  }, [data]);

  const handleFieldChange = (
    index: number,
    field: keyof Address,
    value: string
  ) => {
    const updated = [...addresses];
    updated[index] = { ...updated[index], [field]: value };
    setAddresses(updated);
    onChange(updated);
  };

  const handleAdd = () => {
    const newAddress: Address = {
      country: "",
      city: "",
      street: "",
      postal_code: "",
      type: "mailing",
    };
    const updated = [...addresses, newAddress];
    setAddresses(updated);
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const updated = addresses.filter((_, i) => i !== index);
    setAddresses(updated);
    onChange(updated);
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-xl font-semibold">Addresses</h5>
        <Button size="xs" onClick={() => setEditMode(!editMode)}>
          {editMode ? "Done" : "Edit"}
        </Button>
      </div>

      {addresses.map((address, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 border-b pb-4">
          <div>
            <Label>Country</Label>
            <TextInput
              value={address.country}
              onChange={(e) => handleFieldChange(index, "country", e.target.value)}
              disabled={!editMode}
            />
          </div>

          <div>
            <Label>City</Label>
            <TextInput
              value={address.city}
              onChange={(e) => handleFieldChange(index, "city", e.target.value)}
              disabled={!editMode}
            />
          </div>

          <div>
            <Label>Street</Label>
            <TextInput
              value={address.street}
              onChange={(e) => handleFieldChange(index, "street", e.target.value)}
              disabled={!editMode}
            />
          </div>

          <div>
            <Label>Postal Code</Label>
            <TextInput
              value={address.postal_code || ""}
              onChange={(e) => handleFieldChange(index, "postal_code", e.target.value)}
              disabled={!editMode}
            />
          </div>

          <div>
            <Label>Type</Label>
            <Select
              value={address.type}
              onChange={(e) => handleFieldChange(index, "type", e.target.value)}
              disabled={!editMode}
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}

            </Select>
          </div>

          {editMode && (
            <div className="flex items-end">
              <Button color="failure" size="xs" onClick={() => handleRemove(index)}>
                Remove
              </Button>
            </div>
          )}
        </div>
      ))}

      {editMode && (
        <div className="flex justify-start">
          <Button onClick={handleAdd} size="sm">
            Add Address
          </Button>
        </div>
      )}
    </Card>
  );
};