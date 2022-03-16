import { prisma } from '@/lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  console.log('session');
  console.log(session);

  // Get the home's onwer
  if (req.method === 'GET') {
    try {
      const { id } = req.query;
      console.log('favorite id');
      console.log(id);
      const favoriteHomes = await prisma.user.findMany({
        where: {
          email: session.user.email,
        },
        select: { favoriteHomes: true },
      });
      console.log(favoriteHomes);
      res.status(200).json(favoriteHomes);
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
  // HTTP method not supported!
  else {
    res.setHeader('Allow', ['GET']);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
