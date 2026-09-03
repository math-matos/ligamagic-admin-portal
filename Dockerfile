FROM php:8.5-apache

RUN docker-php-ext-install pdo pdo_mysql

RUN mkdir -p /var/www/html/uploads && chown -R www-data:www-data /var/www/html/uploads

EXPOSE 80
