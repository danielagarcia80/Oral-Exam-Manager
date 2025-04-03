import React from 'react';
import { Flex, Space } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';

import '@mantine/dates/styles.css';

interface Props {
  form: any; // Use specific form type if available
}

export default function DateTimeEntry({ form }: Props) {
  const dateFrom = new Date(form.values.availableFrom);
  const dateTo = new Date(form.values.availableTo);

  return (
    <Flex>
      <DateTimePicker
        size="xl"
        clearable
        label="Available From:"
        placeholder="Pick date and time"
        className="your-class-name"
        value={dateFrom}
        onChange={(date) => form.setFieldValue('availableFrom', date?.toISOString())}
      />
      <Space w="xl" />
      <DateTimePicker
        size="xl"
        clearable
        label="Available Until:"
        placeholder="Pick date and time"
        className="your-class-name"
        value={dateTo}
        onChange={(date) => form.setFieldValue('availableTo', date?.toISOString())}
      />
    </Flex>
  );
}
