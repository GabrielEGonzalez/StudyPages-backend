import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsUUID,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateSubjectDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  color?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  icon?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  position?: number;
}