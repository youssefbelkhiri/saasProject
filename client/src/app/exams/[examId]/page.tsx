"use client";

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

const ExamPage = () => {
  const router = useRouter();
  const { examId } = useParams();

  useEffect(() => {
    if (examId) {
      router.replace(`/exams/${examId}/overview`);
    }
  }, [examId, router]);

  return null;
};

export default ExamPage;
