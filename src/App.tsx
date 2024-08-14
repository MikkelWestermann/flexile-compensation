import { useState, useEffect } from "react";
import { Slider } from "./components/ui/slider";
import { Input } from "./components/ui/input";
import { cn } from "./lib/utils";
import Decimal from "decimal.js";
import { NumericFormat, numericFormatter } from "react-number-format";

type CompensationOptions = {
  stockPrice: number;
  hourlyRate: number;
  minEquitySwap: number;
  maxEquitySwap: number;
  defaultEquitySwap: number;
  minHoursPerWeek: number;
  maxHoursPerWeek: number;
  defaultHoursPerWeek: number;
  minWeeksPerYear: number;
  maxWeeksPerYear: number;
  defaultWeeksPerYear: number;
};

const defaultOptions: CompensationOptions = {
  stockPrice: 11.4,
  hourlyRate: 150,
  minEquitySwap: 0,
  maxEquitySwap: 80,
  defaultEquitySwap: 0,
  minHoursPerWeek: 10,
  maxHoursPerWeek: 35,
  defaultHoursPerWeek: 21,
  minWeeksPerYear: 20,
  maxWeeksPerYear: 44,
  defaultWeeksPerYear: 43,
};

function App() {
  const [options, setOptions] = useState<CompensationOptions>(() => {
    const savedOptions = localStorage.getItem("compensationOptions");
    return savedOptions ? JSON.parse(savedOptions) : defaultOptions;
  });

  useEffect(() => {
    localStorage.setItem("compensationOptions", JSON.stringify(options));
  }, [options]);

  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="flex space-x-8 w-full max-w-6xl">
        <div className="border border-black rounded-2xl p-4 flex-1">
          <H3>Compensation Options</H3>
          <CompensationOptions options={options} setOptions={setOptions} />
        </div>
        <div className="border border-black rounded-2xl p-4 flex-1">
          <H3>Compensation Calculator</H3>
          <CompensationCalculator options={options} />
        </div>
      </div>
    </div>
  );
}

const CompensationOptions = ({
  options,
  setOptions,
}: {
  options: CompensationOptions;
  setOptions: (options: CompensationOptions) => void;
}) => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12">
        <Label>Stock Price</Label>
        <Numeric
          value={options.stockPrice}
          onChange={(value) => setOptions({ ...options, stockPrice: value })}
        />
      </div>

      <div className="col-span-12">
        <Label>Hourly Rate</Label>
        <Numeric
          value={options.hourlyRate}
          onChange={(value) => setOptions({ ...options, hourlyRate: value })}
        />
      </div>

      <div className="col-span-12 md:col-span-4">
        <Label>Min Equity Swap</Label>
        <Numeric
          value={options.minEquitySwap}
          onChange={(value) => setOptions({ ...options, minEquitySwap: value })}
        />
      </div>

      <div className="col-span-12 md:col-span-4">
        <Label>Max Equity Swap</Label>
        <Numeric
          value={options.maxEquitySwap}
          onChange={(value) => setOptions({ ...options, maxEquitySwap: value })}
        />
      </div>

      <div className="col-span-12 md:col-span-4">
        <Label>Default Equity Swap</Label>
        <Numeric
          value={options.defaultEquitySwap}
          onChange={(value) =>
            setOptions({ ...options, defaultEquitySwap: value })
          }
        />
      </div>

      <div className="col-span-12 md:col-span-4">
        <Label>Min Hours Per Week</Label>
        <Numeric
          value={options.minHoursPerWeek}
          onChange={(value) =>
            setOptions({ ...options, minHoursPerWeek: value })
          }
        />
      </div>

      <div className="col-span-12 md:col-span-4">
        <Label>Max Hours Per Week</Label>
        <Numeric
          value={options.maxHoursPerWeek}
          onChange={(value) =>
            setOptions({ ...options, maxHoursPerWeek: value })
          }
        />
      </div>

      <div className="col-span-12 md:col-span-4">
        <Label>Default Hrs/W</Label>
        <Numeric
          value={options.defaultHoursPerWeek}
          onChange={(value) =>
            setOptions({ ...options, defaultHoursPerWeek: value })
          }
        />
      </div>

      <div className="col-span-12 md:col-span-4">
        <Label>Min Weeks Per Year</Label>
        <Numeric
          value={options.minWeeksPerYear}
          onChange={(value) =>
            setOptions({ ...options, minWeeksPerYear: value })
          }
        />
      </div>

      <div className="col-span-12 md:col-span-4">
        <Label>Max Weeks Per Year</Label>
        <Numeric
          value={options.maxWeeksPerYear}
          onChange={(value) =>
            setOptions({ ...options, maxWeeksPerYear: value })
          }
        />
      </div>

      <div className="col-span-12 md:col-span-4">
        <Label>Default W/Y</Label>
        <Numeric
          value={options.defaultWeeksPerYear}
          onChange={(value) =>
            setOptions({ ...options, defaultWeeksPerYear: value })
          }
        />
      </div>
    </div>
  );
};

const CompensationCalculator = ({
  options,
}: {
  options: CompensationOptions;
}) => {
  const [equitySwap, setEquitySwap] = useState(() => {
    const savedEquitySwap = localStorage.getItem("equitySwap");
    return savedEquitySwap
      ? Number(savedEquitySwap)
      : options.defaultEquitySwap;
  });

  const [hoursPerWeek, setHoursPerWeek] = useState(() => {
    const savedHoursPerWeek = localStorage.getItem("hoursPerWeek");
    return savedHoursPerWeek
      ? Number(savedHoursPerWeek)
      : options.defaultHoursPerWeek;
  });

  const [weeksPerYear, setWeeksPerYear] = useState(() => {
    const savedWeeksPerYear = localStorage.getItem("weeksPerYear");
    return savedWeeksPerYear
      ? Number(savedWeeksPerYear)
      : options.defaultWeeksPerYear;
  });

  useEffect(() => {
    localStorage.setItem("equitySwap", equitySwap.toString());
    localStorage.setItem("hoursPerWeek", hoursPerWeek.toString());
    localStorage.setItem("weeksPerYear", weeksPerYear.toString());
  }, [equitySwap, hoursPerWeek, weeksPerYear]);

  const cashPreEquity = new Decimal(options.hourlyRate)
    .times(hoursPerWeek)
    .times(weeksPerYear);

  const equityCompensation = cashPreEquity.times(equitySwap).div(100).round();
  const cashCompensation = cashPreEquity.minus(equityCompensation);
  const cashBonus = equityCompensation.times(0.375);
  const numberOfOptions = equityCompensation.div(options.stockPrice).round();
  const totalCompensation = cashCompensation.plus(cashBonus);

  return (
    <div className="grid grid-cols-12 gap-4 flex-1">
      <div className="col-span-12 space-y-2">
        <Label>
          How much of your hourly rate would you like to swap for equity?
        </Label>

        <div className="flex items-center space-x-4">
          <div className="w-full space-y-2">
            <Slider
              value={[equitySwap]}
              onValueChange={([value]) => setEquitySwap(value)}
              min={options.minEquitySwap}
              max={options.maxEquitySwap}
            />
            <div className="flex justify-between">
              <div className="text-xs text-slate-500">
                {options.minEquitySwap}%
              </div>
              <div className="text-xs text-slate-500">
                {options.maxEquitySwap}%
              </div>
            </div>
          </div>

          <Numeric
            value={equitySwap}
            decimalScale={0}
            onChange={(value) => setEquitySwap(value)}
            suffix="%"
            className="w-24"
          />
        </div>
      </div>

      <div className="col-span-12 flex flex-col space-y-2">
        <Label>How many hours per week will you work?</Label>

        <div className="flex items-center space-x-4">
          <div className="w-full space-y-2">
            <Slider
              value={[hoursPerWeek]}
              onValueChange={([value]) => setHoursPerWeek(value)}
              min={options.minHoursPerWeek}
              max={options.maxHoursPerWeek}
            />
            <div className="flex justify-between">
              <div className="text-xs text-slate-500">
                {options.minHoursPerWeek} hours
              </div>
              <div className="text-xs text-slate-500">
                {options.maxHoursPerWeek} hours
              </div>
            </div>
          </div>

          <Numeric
            value={hoursPerWeek}
            decimalScale={0}
            onChange={(value) => setHoursPerWeek(value)}
            suffix=" hours"
            className="w-24"
          />
        </div>
      </div>

      <div className="col-span-12 space-y-2">
        <Label>How many weeks a year will you work?</Label>

        <div className="flex items-center space-x-4">
          <div className="w-full space-y-2">
            <Slider
              value={[weeksPerYear]}
              onValueChange={([value]) => setWeeksPerYear(value)}
              min={options.minWeeksPerYear}
              max={options.maxWeeksPerYear}
            />
            <div className="flex justify-between">
              <div className="text-xs text-slate-500">
                {options.minWeeksPerYear} weeks
              </div>
              <div className="text-xs text-slate-500">
                {options.maxWeeksPerYear} weeks
              </div>
            </div>
          </div>

          <Numeric
            value={weeksPerYear}
            decimalScale={0}
            suffix=" weeks"
            onChange={(value) => setWeeksPerYear(value)}
            className="w-24"
          />
        </div>
      </div>

      <div className="border border-black rounded-2xl col-span-12">
        <CalculatorResultEntry
          label="Stock Options"
          value={numberOfOptions.toNumber()}
          prefix=""
        />

        <CalculatorResultEntry
          label="Cash"
          value={cashCompensation.toNumber()}
        />

        <CalculatorResultEntry
          label="Cash bonus to exercise options"
          value={cashBonus.toNumber()}
        />

        <CalculatorResultEntry
          label="Total Compensation"
          value={totalCompensation.toNumber()}
          disableBorder
        />
      </div>
    </div>
  );
};

const CalculatorResultEntry = ({
  label,
  value,
  prefix = "$",
  disableBorder = false,
}: {
  label: string;
  value: number;
  prefix?: string;
  disableBorder?: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex justify-between border-black p-4 w-full text-sm",
        !disableBorder && "border-b"
      )}
    >
      <label>{label}</label>
      <div>
        {numericFormatter(`${value}`, {
          prefix,
          decimalScale: 2,
          fixedDecimalScale: false,
          thousandSeparator: true,
        })}
        <span className="text-slate-500"> / year</span>
      </div>
    </div>
  );
};

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xl font-bold mb-4">{children}</h3>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <label>{children}</label>
);

type NumericProps = {
  value: number;
  onChange?: (value: number) => void;
  decimalScale?: number;
  suffix?: string;
  className?: string;
};

const Numeric = ({ value, onChange, ...props }: NumericProps) => {
  return (
    <NumericFormat
      customInput={Input}
      value={value}
      onValueChange={({ floatValue }) => {
        onChange?.(floatValue || 0);
      }}
      decimalScale={2}
      fixedDecimalScale
      thousandSeparator
      {...props}
    />
  );
};

export default App;
