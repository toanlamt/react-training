import { useFormContext, useWatch } from "react-hook-form";
import { Card, Label, TextInput } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { sum } from "../../../../utils/sum";

export const NetWorthSection: React.FC = () => {
  const { control } = useFormContext();

  const incomes = useWatch({ control, name: "incomes" }) || [];
  const assets = useWatch({ control, name: "assets" }) || [];
  const liabilities = useWatch({ control, name: "liabilities" }) || [];
  const sources = useWatch({ control, name: "sources" }) || [];

  const totalNetWorth = sum(incomes) + sum(assets) + sum(sources) - sum(liabilities);

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-xl font-bold">Net Worth</h5>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <div>
          <Label>Total Net Worth</Label>
          <TextInput
            type="number"
            value={totalNetWorth.toFixed(2)}
            readOnly
            disabled
          />
        </div>
      </div>
    </Card>
  );
};
