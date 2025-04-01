import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
<<<<<<< Updated upstream

@Module({
  imports: [
    // TestModule,
    // AuthModule,
    // TokenModule,
    // PrivilegeModule,
    // RoleModule,
    // UserModule,
  UserModule],
  controllers: [AppController],
  providers: [
  //   {
  //     provide: APP_GUARD,
  //     useClass: JwtAuthGuard,
  //   },
    AppService,
    PrismaService,
=======
import { CourseModule } from './course/course.module';
import { TeachesModule } from './teaches/teaches.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { ExamModule } from './exam/exam.module';
import { QuestionModule } from './question/question.module';
import { LearningOutcomeModule } from './learning-outcome/learning-outcome.module';
import { CourseLearningOutcomeModule } from './course-learning-outcome/course-learning-outcome.module';
import { KeywordModule } from './keyword/keyword.module';
import { QuestionImageModule } from './question-image/question-image.module';
import { QuestionKeywordModule } from './question-keyword/question-keyword.module';
import { QuestionOutcomeModule } from './question-outcome/question-outcome.module';
import { QuestionImageLinkModule } from './question-image-link/question-image-link.module';
import { ExamQuestionLinkModule } from './exam-question-link/exam-question-link.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { ExamSubmissionModule } from './exam-submission/exam-submission.module';

@Module({
  imports: [
    UserModule,
    CourseModule,
    TeachesModule,
    EnrollmentModule,
    ExamModule,
    QuestionModule,
    LearningOutcomeModule,
    CourseLearningOutcomeModule,
    KeywordModule,
    QuestionImageModule,
    QuestionKeywordModule,
    QuestionOutcomeModule,
    QuestionImageLinkModule,
    ExamQuestionLinkModule,
    FileUploadModule,
    ExamSubmissionModule,
>>>>>>> Stashed changes
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
