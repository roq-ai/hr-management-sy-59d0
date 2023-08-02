import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { evaluationValidationSchema } from 'validationSchema/evaluations';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.evaluation
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getEvaluationById();
    case 'PUT':
      return updateEvaluationById();
    case 'DELETE':
      return deleteEvaluationById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getEvaluationById() {
    const data = await prisma.evaluation.findFirst(convertQueryToPrismaUtil(req.query, 'evaluation'));
    return res.status(200).json(data);
  }

  async function updateEvaluationById() {
    await evaluationValidationSchema.validate(req.body);
    const data = await prisma.evaluation.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteEvaluationById() {
    const data = await prisma.evaluation.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
