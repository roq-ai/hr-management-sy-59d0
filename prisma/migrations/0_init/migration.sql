-- CreateTable
CREATE TABLE "evaluation" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "evaluation_date" DATE NOT NULL,
    "performance_score" INTEGER NOT NULL,
    "student_id" UUID,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subject" VARCHAR(255) NOT NULL,
    "score" INTEGER NOT NULL,
    "student_id" UUID,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "description" VARCHAR(255),
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "tenant_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "user_id" UUID,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "roq_user_id" VARCHAR(255) NOT NULL,
    "tenant_id" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vacation" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "student_id" UUID,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vacation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "evaluation" ADD CONSTRAINT "evaluation_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marks" ADD CONSTRAINT "marks_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organization" ADD CONSTRAINT "organization_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vacation" ADD CONSTRAINT "vacation_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

