import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Label, TextInput, Select, Button, Card } from "flowbite-react";
import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { FinancialTypes } from '../../../../shared/types/kyc';
import { sum } from "../../../../utils/sum";

interface Props {
    readOnly?: boolean;
    editMode?: boolean;
}

export const financialStatusSchema = yup.object({
    incomes: yup.array().of(
        yup.object({
            income_type: yup.string().optional(),
            amount: yup.number().optional(),
        })
    ).optional(),
    assets: yup.array().of(
        yup.object({
            asset_type: yup.string().optional(),
            amount: yup.number().optional(),
        })
    ).optional(),
    liabilities: yup.array().of(
        yup.object({
            liability_type: yup.string().optional(),
            amount: yup.number().optional(),
        })
    ).optional(),
    wealth_sources: yup.array().of(
        yup.object({
            source_type: yup.string().optional(),
            amount: yup.number().optional(),
        })
    ).optional(),
});

export const FinancialStatusSection: React.FC<Props> = ({ readOnly = false, editMode = false }) => {
    const { control, register, formState: { errors } } = useFormContext();

    const createArray = (name: keyof typeof FinancialTypes) => {
        return useFieldArray({ control, name });
    };

    const sections = [
        { name: "incomes", type: "income_type", label: "Incomes (A)" },
        { name: "assets", type: "asset_type", label: "Assets (B)" },
        { name: "liabilities", type: "liability_type", label: "Liabilities (C)" },
        { name: "wealth_sources", type: "source_type", label: "Source of Wealth (D)" },
    ] as const;

    return (
        <>
            {sections.map((section) => {
                const { fields, append, remove } = createArray(section.name);
                const sectionErrors = errors?.[section.name];
                const showTotal = section.name === "liabilities" || section.name === "wealth_sources";
                const watchedSection = useWatch({ control, name: section.name }) || [];
                const totalAmount = showTotal ? sum(watchedSection) : 0;

                return (

                    <Card>
                        <div key={section.name} className="flex justify-between items-center mb-4">
                            <h5 className="text-xl font-bold">{section.label}</h5>
                        </div>

                        {fields.map((field, idx) => (
                            <div
                                key={field.id || idx}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end"
                            >
                                <div>
                                    <Label>Type</Label>
                                    <Select
                                        {...register(`${section.name}.${idx}.${section.type}` as const)}
                                        disabled={!editMode}
                                    >
                                        {FinancialTypes[section.name].map((opt) => (
                                            <option key={opt.key} value={opt.key}>{opt.label}</option>
                                        ))}
                                    </Select>
                                    {Array.isArray(sectionErrors) && sectionErrors[idx]?.[section.type] && (
                                        <p className="text-sm text-red-500">
                                            {sectionErrors[idx][section.type]?.message as string}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label>Amount (Currency)</Label>
                                    <TextInput
                                        type="number"
                                        step="1"
                                        {...register(`${section.name}.${idx}.amount` as const)}
                                        disabled={!editMode}
                                    />
                                    {Array.isArray(sectionErrors) && sectionErrors?.[idx]?.amount && (
                                        <p className="text-sm text-red-500">
                                            {sectionErrors[idx].amount.message as string}
                                        </p>
                                    )}
                                </div>

                                {!readOnly && (
                                    <div className="flex">
                                        <Button
                                            size="xs"
                                            color="failure"
                                            onClick={() => remove(idx)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {showTotal && (
                            <div>
                                <Label>Total {section.name}</Label>
                                <TextInput
                                    value={totalAmount.toFixed(2)}
                                    readOnly
                                    disabled
                                />
                            </div>
                        )}
                        {editMode && !readOnly && (
                            <div className="flex justify-start">
                                <Button
                                    size="sm"
                                    color="blue"
                                    onClick={() => append({ [section.type]: "", amount: 0 })}
                                >
                                    Add {section.label.slice(0, -3)}
                                </Button>
                            </div>
                        )}
                    </Card>
                );
            })}

        </>
    )
};