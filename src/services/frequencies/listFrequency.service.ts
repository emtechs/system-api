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
  by,
}: IFrequencyQuery) => {
  if (take) take = +take;
  if (skip) skip = +skip;

  let objData = {};
  let orderBy = {};
  let orderByStudent = {};

  if (order) {
    switch (order) {
    case 'created_at':
      orderBy = { created_at: by };
      break;

    case 'date':
      orderBy = { date_time: by };
      break;

    case 'finished_at':
      orderBy = { finished_at: by };
      break;

    case 'infreq':
      orderBy = { infreq: by };
      break;
    }
    if (order === 'name') orderByStudent = { name: by };
  }

  if (status) objData = { ...objData, status };
  if (date) objData = { ...objData, date };
  if (class_id) objData = { ...objData, class_id };
  if (school_id) objData = { ...objData, school_id };
  if (year_id) objData = { ...objData, year_id };

  if (is_dash) {
    const [frequencies, total] = await Promise.all([
      prisma.frequency.findMany({
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
      }),
      prisma.frequency.count({
        where: { status: 'OPENED' },
      }),
    ]);

    const frequenciesReturn = await freqArrParseFrequency(frequencies);

    const frequencySchema = FrequencyInfreqArraySchema.parse(frequenciesReturn);

    return {
      total,
      result: frequencySchema,
    };
  }

  const [frequencies, total] = await Promise.all([
    prisma.frequency.findMany({
      take,
      skip,
      where: { AND: { ...objData } },
      include: {
        _count: true,
        user: true,
        class: { include: { school: true, year: true, class: true } },
        students: {
          include: { student: true },
          orderBy: { student: orderByStudent },
        },
      },
      orderBy,
    }),
    prisma.frequency.count({
      where: { AND: { ...objData } },
    }),
  ]);

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
