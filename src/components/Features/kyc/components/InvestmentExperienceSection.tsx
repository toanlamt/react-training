import { useFormContext } from "react-hook-form";
import { Label, Select, Card } from "flowbite-react";
import * as yup from "yup";
import { ExperienceOptions, RiskOptions } from '../../../../shared/types/kyc';

interface Props {
    editMode?: boolean;
}

export const investmentExperienceSchema = yup.object({
    market_experience: yup
        .string()
        .optional(),
    risk_tolerance: yup
        .string()
        .optional(),
});


export const InvestmentExperienceSection: React.FC<Props> = ({ editMode = false }) => {
    const { register, formState: { errors } } = useFormContext();

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h5 className="text-xl font-bold">Investment Experience and Objectives</h5>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                    <Label>Experience in Financial Markets</Label>
                    <Select {...register("market_experience")} disabled={!editMode}>
                        {ExperienceOptions.map((opt) => (
                            <option key={opt.key} value={opt.key}>{opt.label}</option>
                        ))}
                    </Select>
                    {errors.market_experience && (
                        <p className="text-sm text-red-500">{errors.market_experience.message as string}</p>
                    )}
                </div>

                <div>
                    <Label>Risk Tolerance</Label>
                    <Select {...register("risk_tolerance")} disabled={!editMode}>
                        {RiskOptions.map((opt) => (
                            <option key={opt.key} value={opt.key}>{opt.label}</option>
                        ))}
                    </Select>
                    {errors.risk_tolerance && (
                        <p className="text-sm text-red-500">{errors.risk_tolerance.message as string}</p>
                    )}
                </div>
            </div>
        </Card>
    );
};
