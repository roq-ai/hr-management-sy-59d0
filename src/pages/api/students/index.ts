import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { studentValidationSchema } from 'validationSchema/students';
import { convertQueryToPrismaUtil, getOrderByOptions, parseQueryParams } from 'server/utils';
import { getServerSession } from '@roq/nextjs';
import { GetManyQueryOptions } from 'interfaces';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getStudents();
    case 'POST':
      return createStudent();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getStudents() {
    const {
      limit: _limit,
      offset: _offset,
      order,
      ...query
    } = parseQueryParams(req.query) as Partial<GetManyQueryOptions>;
    const limit = parseInt(_limit as string, 10) || 20;
    const offset = parseInt(_offset as string, 10) || 0;
    const response = await prisma.student
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findManyPaginated({
        ...convertQueryToPrismaUtil(query, 'student'),
        take: limit,
        skip: offset,
        ...(order?.length && {
          orderBy: getOrderByOptions(order),
        }),
      });
    return res.status(200).json(response);
  }

  async function createStudent() {
    await studentValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.evaluation?.length > 0) {
      const create_evaluation = body.evaluation;
      body.evaluation = {
        create: create_evaluation,
      };
    } else {
      delete body.evaluation;
    }
    if (body?.marks?.length > 0) {
      const create_marks = body.marks;
      body.marks = {
        create: create_marks,
      };
    } else {
      delete body.marks;
    }
    if (body?.vacation?.length > 0) {
      const create_vacation = body.vacation;
      body.vacation = {
        create: create_vacation,
      };
    } else {
      delete body.vacation;
    }
    const data = await prisma.student.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
