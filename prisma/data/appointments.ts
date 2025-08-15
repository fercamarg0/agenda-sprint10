import { faker } from '@faker-js/faker';
import { Service } from '@prisma/client';

export interface AppointmentSeed {
  businessId: string;
  userBusinessId: string;
  customerId: string;
  serviceId: string;
  date: Date;
  startTime: Date;
  start: Date;
}

export function createAppointmentsForBusiness(
  businessId: string,
  customerIds: string[],
  services: Service[],
  professionalIds: string[], // These are now UserBusiness IDs
  count: number,
): AppointmentSeed[] {
  const appointments: AppointmentSeed[] = [];
  if (professionalIds.length === 0 || customerIds.length === 0 || services.length === 0) {
    return [];
  }

  for (let i = 0; i < count; i++) {
    const randomProfessionalId = faker.helpers.arrayElement(professionalIds);
    const randomCustomerId = faker.helpers.arrayElement(customerIds);
    const randomService = faker.helpers.arrayElement(services);

    // Generate a random date in the past or near future
    const appointmentStartDateTime = faker.date.between({
      from: new Date(new Date().setMonth(new Date().getMonth() - 2)),
      to: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    });

    // Ensure appointments are during business hours (e.g., 9 AM to 6 PM)
    appointmentStartDateTime.setHours(faker.number.int({ min: 9, max: 17 }), faker.helpers.arrayElement([0, 15, 30, 45]), 0, 0);
    
    // The 'date' and 'startTime' fields in Prisma will automatically handle
    // the Date and Time parts from this single 'start' DateTime object.
    const appointment: AppointmentSeed = {
      businessId,
      userBusinessId: randomProfessionalId,
      customerId: randomCustomerId,
      serviceId: randomService.id,
      start: appointmentStartDateTime,
      date: appointmentStartDateTime, 
      startTime: appointmentStartDateTime,
    };

    appointments.push(appointment);
  }

  return appointments;
}
