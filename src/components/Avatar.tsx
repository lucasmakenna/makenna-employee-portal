import clsx from 'clsx';
import { Employee } from '@/types';
import { initials } from '@/data/employees';

export default function Avatar({
  employee,
  size = 'md',
}: {
  employee: Pick<Employee, 'firstName' | 'lastName' | 'avatarColor'>;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const dim = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base',
    xl: 'h-20 w-20 text-xl',
  }[size];
  return (
    <div
      className={clsx(
        'flex shrink-0 items-center justify-center rounded-full font-bold text-white',
        dim,
      )}
      style={{ backgroundColor: employee.avatarColor }}
    >
      {initials(employee)}
    </div>
  );
}
