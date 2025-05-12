import { prisma } from '../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';

export async function getModules() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error('Unauthorized');
  }

  const modules = await prisma.trainingModule.findMany({
    where: {
      OR: [
        { isPublic: true },
        { assignedTo: { some: { id: session.user.id } } },
      ],
    },
    include: {
      resources: true,
      quiz: {
        include: {
          questions: true,
        },
      },
      progress: {
        where: {
          userId: session.user.id,
        },
      },
    },
  });

  return modules.map(module => ({
    ...module,
    progress: module.progress[0]?.progress || 0,
    status: module.progress[0]?.status || 'not_started',
  }));
}

export async function updateModuleProgress(moduleId: string, progress: number) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error('Unauthorized');
  }

  const status = progress === 100 ? 'completed' : 'in_progress';

  await prisma.moduleProgress.upsert({
    where: {
      userId_moduleId: {
        userId: session.user.id,
        moduleId,
      },
    },
    update: {
      progress,
      status,
    },
    create: {
      userId: session.user.id,
      moduleId,
      progress,
      status,
    },
  });

  return { success: true };
}

export async function submitQuiz(moduleId: string, answers: number[]) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error('Unauthorized');
  }

  const module = await prisma.trainingModule.findUnique({
    where: { id: moduleId },
    include: {
      quiz: {
        include: {
          questions: true,
        },
      },
    },
  });

  if (!module?.quiz) {
    throw new Error('Quiz not found');
  }

  // Calculate score
  let correctAnswers = 0;
  answers.forEach((answer, index) => {
    if (answer === module.quiz!.questions[index].correctAnswer) {
      correctAnswers++;
    }
  });

  const score = Math.round((correctAnswers / answers.length) * 100);
  const passed = score >= module.quiz.passingScore;

  // Record attempt
  await prisma.quizAttempt.create({
    data: {
      userId: session.user.id,
      quizId: module.quiz.id,
      score,
      answers: answers,
    },
  });

  // Update best score if needed
  const bestAttempt = await prisma.quizAttempt.findFirst({
    where: {
      userId: session.user.id,
      quizId: module.quiz.id,
    },
    orderBy: {
      score: 'desc',
    },
  });

  if (!bestAttempt || score > bestAttempt.score) {
    await prisma.quiz.update({
      where: { id: module.quiz.id },
      data: {
        bestScore: score,
      },
    });
  }

  return { score, passed };
}

export async function generateShareLink(moduleId: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error('Unauthorized');
  }

  const module = await prisma.trainingModule.findUnique({
    where: { id: moduleId },
  });

  if (!module) {
    throw new Error('Module not found');
  }

  // Generate a unique share token
  const shareToken = await prisma.shareToken.create({
    data: {
      moduleId,
      createdById: session.user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  return {
    shareUrl: `${process.env.NEXT_PUBLIC_APP_URL}/training/shared/${shareToken.token}`,
  };
}

export async function downloadResource(resourceId: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error('Unauthorized');
  }

  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
  });

  if (!resource) {
    throw new Error('Resource not found');
  }

  // Check if user has access to the resource
  const module = await prisma.trainingModule.findFirst({
    where: {
      resources: {
        some: { id: resourceId },
      },
      OR: [
        { isPublic: true },
        { assignedTo: { some: { id: session.user.id } } },
      ],
    },
  });

  if (!module) {
    throw new Error('Unauthorized');
  }

  // Return the resource URL
  return resource.url;
} 