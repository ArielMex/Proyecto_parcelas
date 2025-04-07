import { IsString, IsEmail, IsOptional, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @ApiProperty({ example: 'Juan Carlos Perez', description: 'Nombre del usuario', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'juan@example.com', description: 'Email del usuario', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'newpassword123', description: 'Contraseña del usuario', required: false })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ example: '1990-01-01', description: 'Fecha de cumpleaños del usuario (YYYY-MM-DD)', required: false })
  @IsOptional()
  @Type(() => Date)
  date_birthday?: Date;
}