# AirBooking – Flight Booking System

## Project Overview

AirBooking is a full-stack flight booking application developed using React and Django REST Framework. It allows users to search for available flights, view flight details, book tickets, simulate payments, and manage their trips. It also provides administrative functionality for managing users, flights, and flight statuses.

The application uses JWT-based authentication to secure API endpoints and manage user sessions.

## Features

### User Features

- User registration and login.
- JWT-based authentication.
- Flight search by source, destination, and departure date.
- View flight details, pricing, availability, and status.
- Book available flights by selecting the number of seats.
- Simulated payment processing.
- Booking confirmation.
- View personal bookings under My Trips.
- Cancel eligible bookings.
- View flight status, including On Time, Delayed, and Cancelled.

### Admin Features

- Admin dashboard.
- View and manage user accounts.
- Approve or reject pending user accounts.
- View all flights.
- Add new flights.
- Edit existing flight details.
- Delete flights when they have no associated bookings.
- Update flight status.
- Monitor flight and booking information.

### Current Registration Behaviour

Newly registered users are automatically approved and can log in without waiting for manual approval.

## Technologies Used

### Frontend

- React
- Vite
- JavaScript
- HTML
- CSS
- Axios
- React Router DOM

### Backend

- Python
- Django
- Django REST Framework
- Simple JWT
- Django Filter
- Celery

### Database

- Configured through the Django backend settings.
