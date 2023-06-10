import { IFrequencyQuery } from '../../interfaces';
import prisma from '../../prisma';
import {
  FrequencyArraySchema,
  FrequencyInfreqArraySchema,
} from '../../schemas';
import { freqArrParseFrequency } from '../../scripts';

export const listFrequencyService = async ({
  take,
  status,
  date,
  class_id,
  is_infreq,
  is_dash,
  school_id,
  skip,
  year_id,
}: IFrequencyQuery) => {
  if (take) take = +take;
  if (skip) skip = +skip;

  if (school_id) {
    const frequencies = await prisma.frequency.findMany({
      take,
      skip,
      where: { AND: { status: 'OPENED', school_id } },
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
      where: { AND: { status: 'OPENED', school_id } },
    });

    return {
      total,
      result: frequencySchema,
    };
  }

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

  if (status) {
    if (year_id) {
      const frequencies = await prisma.frequency.findMany({
        take,
        skip,
        where: { AND: { status, year_id } },
        include: {
          _count: true,
          user: true,
          class: { include: { school: true, year: true, class: true } },
          students: {
            include: { student: true },
            orderBy: { student: { name: 'asc' } },
          },
        },
        orderBy: { date: 'asc' },
      });

      const total = await prisma.frequency.count({
        where: { AND: { status, year_id } },
      });

      if (is_infreq) {
        const frequenciesReturn = await freqArrParseFrequency(frequencies);

        const frequencySchema =
          FrequencyInfreqArraySchema.parse(frequenciesReturn);

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
    }

    const frequencies = await prisma.frequency.findMany({
      take,
      skip,
      where: { status },
      include: {
        _count: true,
        user: true,
        class: { include: { school: true, year: true, class: true } },
        students: {
          include: { student: true },
          orderBy: { student: { name: 'asc' } },
        },
      },
      orderBy: { finished_at: 'desc' },
    });

    const total = await prisma.frequency.count({ where: { status } });

    if (is_infreq) {
      const frequenciesReturn = await freqArrParseFrequency(frequencies);

      const frequencySchema =
        FrequencyInfreqArraySchema.parse(frequenciesReturn);

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
  }

  if (date) {
    const frequencies = await prisma.frequency.findMany({
      take,
      skip,
      where: { date },
      include: {
        _count: true,
        user: true,
        class: { include: { school: true, year: true, class: true } },
        students: {
          include: { student: true },
          orderBy: { student: { name: 'asc' } },
        },
      },
      orderBy: { finished_at: 'desc' },
    });

    const total = await prisma.frequency.count({ where: { date } });

    if (is_infreq) {
      const frequenciesReturn = await freqArrParseFrequency(frequencies);

      const frequencySchema =
        FrequencyInfreqArraySchema.parse(frequenciesReturn);

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
  }

  if (class_id) {
    const frequencies = await prisma.frequency.findMany({
      take,
      skip,
      where: { class_id },
      include: {
        _count: true,
        user: true,
        class: { include: { school: true, year: true, class: true } },
        students: {
          include: { student: true },
          orderBy: { student: { name: 'asc' } },
        },
      },
      orderBy: { finished_at: 'desc' },
    });

    const total = await prisma.frequency.count({ where: { class_id } });

    if (is_infreq) {
      const frequenciesReturn = await freqArrParseFrequency(frequencies);

      const frequencySchema =
        FrequencyInfreqArraySchema.parse(frequenciesReturn);

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
  }

  const frequencies = await prisma.frequency.findMany({
    take,
    skip,
    include: {
      _count: true,
      user: true,
      class: { include: { school: true, year: true, class: true } },
      students: {
        include: { student: true },
        orderBy: { student: { name: 'asc' } },
      },
    },
    orderBy: { finished_at: 'desc' },
  });

  if (is_infreq) {
    const frequenciesReturn = await freqArrParseFrequency(frequencies);

    const frequencySchema = FrequencyInfreqArraySchema.parse(frequenciesReturn);

    const total = await prisma.frequency.count();

    return {
      total,
      result: frequencySchema,
    };
  }

  const frequencySchema = FrequencyArraySchema.parse(frequencies);

  const total = await prisma.frequency.count();

  return {
    total,
    result: frequencySchema,
  };
};
