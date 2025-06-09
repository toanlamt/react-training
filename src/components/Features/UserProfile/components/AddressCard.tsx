import { Card, Label, TextInput, Select, Button, HR } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { Address, AddressType } from '../../../../shared/types/userProfile';

type Props = {
  data: Address[];
  onChange: (addresses: Address[]) => void;
  readOnly?: boolean;
};

const types: AddressType[] = ['mailing', 'work'];

const addressSchema = yup.object({
  country: yup.string().required("Country is required"),
  city: yup.string().required("City is required"),
  street: yup.string().required("Street is required"),
  postal_code: yup.string().required("Postal Code is required"),
  type: yup.mixed<AddressType>().oneOf(["mailing", "work"]).required(),
});

const addressListSchema = yup.object({
  addresses: yup.array().of(addressSchema).required("Addresses are required"),
});

export const AddressCard: React.FC<Props> = ({ data, onChange, readOnly }) => {
  const [editMode, setEditMode] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ addresses: Address[] }>({
    defaultValues: { addresses: data },
    resolver: yupResolver(addressListSchema),
  });

  useEffect(() => {
    reset({ addresses: data });
  }, [data, reset]);


  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  const onSubmit = (values: { addresses: Address[] }) => {
    const cleaned = values.addresses.filter(
      (addr) =>
        addr.country.trim() ||
        addr.city.trim() ||
        addr.street.trim() ||
        addr.postal_code.trim()
    );
    console.log(cleaned);
    onChange(cleaned);
    setEditMode(false);
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-xl font-semibold">Addresses</h5>
        {!readOnly && (
          <Button size="xs" onClick={editMode ? handleSubmit(onSubmit) : () => setEditMode(true)}>
            {editMode ? "Save" : "Edit"}
          </Button>
        )}
      </div>

      {fields.map((field, index) => (
        <><div
          key={field.id}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 items-end"
        >
          <div>
            <Label>Country</Label>
            <TextInput {...register(`addresses.${index}.country`)} disabled={!editMode} />
            {errors.addresses?.[index]?.country && (
              <p className="text-red-500 text-sm">{errors.addresses[index]?.country?.message}</p>
            )}
          </div>

          <div>
            <Label>City</Label>
            <TextInput {...register(`addresses.${index}.city`)} disabled={!editMode} />
            {errors.addresses?.[index]?.city && (
              <p className="text-red-500 text-sm">{errors.addresses[index]?.city?.message}</p>
            )}
          </div>

          <div>
            <Label>Street</Label>
            <TextInput {...register(`addresses.${index}.street`)} disabled={!editMode} />
            {errors.addresses?.[index]?.street && (
              <p className="text-red-500 text-sm">{errors.addresses[index]?.street?.message}</p>
            )}
          </div>

          <div>
            <Label>Postal Code</Label>
            <TextInput {...register(`addresses.${index}.postal_code`)} disabled={!editMode} />
            {errors.addresses?.[index]?.postal_code && (
              <p className="text-red-500 text-sm">{errors.addresses[index]?.postal_code?.message}</p>
            )}
          </div>

          <div>
            <Label>Type</Label>
            <Select {...register(`addresses.${index}.type`)} disabled={!editMode}>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </Select>
          </div>

          {editMode && (
            <div className="col-span-2 text-right">
              <Button size="xs" color="failure" onClick={() => remove(index)}>
                Remove
              </Button>
            </div>
          )}
        </div>
        {index < fields.length - 1 && <HR />}</>
      ))}

      {editMode && !readOnly && (
        <div className="flex justify-start">
            <Button size="sm" onClick={() => append({ country: "", city: "", street: "", postal_code: "", type: "mailing" })}>
            Add Address
          </Button>
        </div>
      )}
    </Card>
  );
};