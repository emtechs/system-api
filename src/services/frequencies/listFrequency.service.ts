import { IFrequencyQuery } from '../../interfaces';
import prisma from '../../prisma';
import {
  FrequencyArraySchema,
  FrequencyInfreqArraySchema,
} from '../../schemas';
import { freqArrParseFrequency } from '../../scripts';

export const listFrequencyService = async ({
  take,
  skip,
  status,
  is_dash,
  is_infreq,
  date,
  class_id,
  school_id,
  year_id,
  order,
}: IFrequencyQuery) => {
  if (take) take = +take;
  if (skip) skip = +skip;

  let objData = {};
  let orderBy = {};

  if (order) {
    switch (order) {
    case 'created_at_asc':
      orderBy = { created_at: 'asc' };
      break;

    case 'created_at_desc':
      orderBy = { created_at: 'desc' };
      break;

    case 'date_asc':
      orderBy = { date: 'asc' };
      break;

    case 'date_desc':
      orderBy = { date: 'desc' };
      break;

    case 'finished_at_asc':
      orderBy = { finished_at: 'asc' };
      break;

    case 'finished_at_desc':
      orderBy = { finished_at: 'desc' };
      break;
    }
  }

  if (status) objData = { ...objData, status };
  if (date) objData = { ...objData, date };
  if (class_id) objData = { ...objData, class_id };
  if (school_id) objData = { ...objData, school_id };
  if (year_id) objData = { ...objData, year_id };

  if (is_dash) {
    const frequencies = await prisma.frequency.findMany({
      take,
      skip,
      where: { status: 'OPENED' },
      include: {
        _count: true,
        user: true,
        class: { include: { school: true, year: true, class: true } },
        students: {
          include: { student: true },
          orderBy: { student: { name: 'asc' } },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    const frequenciesReturn = await freqArrParseFrequency(frequencies);

    const frequencySchema = FrequencyInfreqArraySchema.parse(frequenciesReturn);

    const total = await prisma.frequency.count({
      where: { status: 'OPENED' },
    });

    return {
      total,
      result: frequencySchema,
    };
  }

  const frequencies = await prisma.frequency.findMany({
    take,
    skip,
    where: { AND: { ...objData } },
    include: {
      _count: true,
      user: true,
      class: { include: { school: true, year: true, class: true } },
      students: {
        include: { student: true },
        orderBy: { student: { name: 'asc' } },
      },
    },
    orderBy,
  });

  const total = await prisma.frequency.count({
    where: { AND: { ...objData } },
  });

  if (is_infreq) {
    const frequenciesReturn = await freqArrParseFrequency(frequencies);

    const frequencySchema = FrequencyInfreqArraySchema.parse(frequenciesReturn);

    return {
      total,
      result: frequencySchema,
    };
  }

  const frequencySchema = FrequencyArraySchema.parse(frequencies);

  return {
    total,
    result: frequencySchema,
  };
};
