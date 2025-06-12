import { Card, Label, TextInput, Select, Button, HR } from "flowbite-react";
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { Contact, WorkType, SubWorkType } from '../../../../shared/types/userProfile';

type Props = {
  data: Contact[];
  onChange: (contacts: Contact[]) => void;
  readOnly?: boolean;
  type: WorkType;
};

const subtypes: SubWorkType[] = ['work', 'personal'];

const contactSchema = yup.object({
  type: yup.mixed<WorkType>().oneOf(["email", "phone"]).required(),
  value: yup
    .string()
    .required("Value is required")
    .when("type", {
      is: "email",
      then: (schema) => schema.email("Invalid email format"),
    }),
  subtype: yup.mixed<SubWorkType>().oneOf(["work", "personal"]).required(),
  preferred: yup.boolean().required(),
});

const contactListSchema = yup.object({
  contacts: yup.array().of(contactSchema).required("Contacts are required"),
});


export const ContactCard: React.FC<Props> = ({ data, onChange, readOnly, type }) => {
  const [editMode, setEditMode] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<{ contacts: Contact[] }>({
    defaultValues: { contacts: data },
    resolver: yupResolver(contactListSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contacts",
  });

  const contacts = watch("contacts");

  const onSubmit = (values: { contacts: Contact[] }) => {
    const filtered = values.contacts.filter((c) => c.value.trim());

    // Ensure only 1 preferred = true
    let preferredAssigned = false;
    const normalized = filtered.map((c) => {
      if (!preferredAssigned && c.preferred) {
        preferredAssigned = true;
        return c;
      } else {
        return { ...c, preferred: false };
      }
    });

    onChange(normalized);
    setEditMode(false);
  };

  const handlePreferredChange = (index: number, value: string) => {
    const updated = contacts.map((c, i) => ({
      ...c,
      preferred: i === index ? value === "true" : false,
    }));
    reset({ contacts: updated });
  };

  useEffect(() => {
    if (data) {
      reset({ contacts: data });
    }
  }, [data, reset]);

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-xl font-semibold">{type === "email" ? "Emails" : "Phones"}</h5>
        {!readOnly && (
          <Button size="xs" onClick={editMode ? handleSubmit(onSubmit) : () => setEditMode(true)}>
            {editMode ? "Save" : "Edit"}
          </Button>
        )}
      </div>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end"
        >

          <input type="hidden" {...register(`contacts.${index}.type`)} value={type} />

          <div>
            <Label>{type === "email" ? "Email Address" : "Phone"}</Label>
            <TextInput {...register(`contacts.${index}.value`)} disabled={!editMode} />
            {errors.contacts?.[index]?.value && (
              <p className="text-red-500 text-sm">{errors.contacts[index]?.value?.message}</p>
            )}
          </div>

          <div>
            <Label>Type</Label>
            <Select {...register(`contacts.${index}.subtype`)} disabled={!editMode}>
              {subtypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label>Preferred</Label>
            <Select
              value={contacts[index]?.preferred ? "true" : "false"}
              onChange={(e) => handlePreferredChange(index, e.target.value)}
              disabled={!editMode}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </Select>
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


      {editMode && (
        <div className="flex justify-start">
          <Button onClick={() =>
            append({
              type,
              value: "",
              subtype: "work",
              preferred: contacts.length === 0,
            })
          } size="sm">
            Add {type === "email" ? "Email" : "Phone"}
          </Button>
        </div>
      )}
    </Card>
  );
};