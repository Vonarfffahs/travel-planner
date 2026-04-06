import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../../../components/ui/Input';
import { Toggle, type Option } from '../../../../components/ui/Toggle';
import { Button } from '../../../../components/ui/Button';
import { useEffect, useState } from 'react';
import { algorithmsAPI } from '../../../../api';
import type { CreateAlgorithmParameters } from '../../../../types';
import { useDispatch, useSelector } from 'react-redux';
import { setCalculatedTrip } from '../../../../store/tripSlice';
import { Calculator, CalendarClock, CircleDollarSign } from 'lucide-react';
import type { StoreState } from '../../../../store';

import styles from './PlannerForm.module.css';

// input rules
const plannerSchema = z.object({
  maxCostLimit: z
    .number({ message: 'Please enter number' })
    .min(0, 'Budget cannot be negative'),
  maxTimeLimit: z
    .number({ message: 'Please enter number' })
    .min(0, 'Time (days) cannot be negative'),
  algorithmId: z.string().min(1, 'Choose algorithm'),
});

// type from planner schema
type PlannerFormValues = z.infer<typeof plannerSchema>;

interface PlannerFormProps {
  isViewMode?: boolean;
  isEditMode?: boolean;
}

export const PlannerForm = ({ isViewMode = false }: PlannerFormProps) => {
  const dispatch = useDispatch();
  const { maxCostLimit, maxTimeLimit, calculatedTrip } = useSelector(
    (state: StoreState) => state.trip,
  );

  const [algorithmOptions, setAlgorithmOptions] = useState<Option[]>([]);
  const [areAlgoLoading, setAreAlgoLoading] = useState<boolean>(true);
  const [isBtnLoading, setIsBtnLoading] = useState<boolean>(false);

  const form = useForm<PlannerFormValues>({
    resolver: zodResolver(plannerSchema), // zod connection
    defaultValues: {
      algorithmId: '',
      maxCostLimit: 0,
      maxTimeLimit: 0,
    },
  });

  const handleSubmit = async (data: PlannerFormValues) => {
    setIsBtnLoading(true);
    try {
      const algorithmParameters: CreateAlgorithmParameters = {
        alpha: 1,
        beta: 1.5,
        evaporationRate: 0.65,
        iterations: 25,
        antCount: 10,
      };

      const response = await algorithmsAPI.calculateTrip({
        ...data,
        parameters: algorithmParameters,
      });

      dispatch(
        setCalculatedTrip({
          trip: response,
          maxCostLimit: data.maxCostLimit,
          maxTimeLimit: data.maxTimeLimit,
        }),
      );

      console.log(response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsBtnLoading(false);
    }
  };

  useEffect(() => {
    if (maxCostLimit !== null) {
      form.setValue('maxCostLimit', maxCostLimit);
    }
    if (maxTimeLimit !== null) {
      form.setValue('maxTimeLimit', maxTimeLimit);
    }
    if (calculatedTrip?.algorithmId) {
      form.setValue('algorithmId', calculatedTrip.algorithmId);
    }
  }, [maxCostLimit, maxTimeLimit, calculatedTrip, form]);

  useEffect(() => {
    const fetchAlgorithms = async () => {
      try {
        const response = await algorithmsAPI.getAlgorithms();

        const formattedOptions: Option[] = response.data.map((algo) => ({
          label: algo.name,
          value: algo.id,
          description: algo.description,
        }));

        setAlgorithmOptions(formattedOptions);

        if (formattedOptions.length > 0) {
          const savedAlgorithmId = calculatedTrip?.algorithmId;
          form.setValue(
            'algorithmId',
            savedAlgorithmId ? savedAlgorithmId : formattedOptions[0].value,
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setAreAlgoLoading(false);
      }
    };

    fetchAlgorithms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const circleDollarSign = <CircleDollarSign size={16} />;
  const calendarClockIcon = <CalendarClock size={16} />;
  const calculatorIcon = <Calculator size={16} />;

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.form}>
      <Input
        label="Budget"
        icon={circleDollarSign}
        type="number"
        error={form.formState.errors.maxCostLimit?.message}
        disabled={isViewMode}
        {...form.register('maxCostLimit', { valueAsNumber: true })}
      />

      <Input
        label="Time Limit (Days)"
        type="number"
        icon={calendarClockIcon}
        error={form.formState.errors.maxTimeLimit?.message}
        disabled={isViewMode}
        {...form.register('maxTimeLimit', { valueAsNumber: true })}
      />

      {areAlgoLoading ? (
        <p>Loading algorithms...</p>
      ) : (
        <Controller
          name="algorithmId"
          control={form.control}
          render={({ field }) => (
            <Toggle
              label="Choose algorithm"
              options={algorithmOptions}
              value={field.value}
              onChange={field.onChange}
              disabled={isViewMode}
            />
          )}
        />
      )}

      {!isViewMode && (
        <Button type="submit" isLoading={isBtnLoading}>
          {calculatorIcon}&nbsp;Calculate route
        </Button>
      )}
    </form>
  );
};
