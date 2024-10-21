#ifndef FILMDB_H
#define FILMDB_H

#include <QString>
#include <QList>
#include <QSqlDatabase>
#include <QSqlQuery>
#include <QSqlError>
#include <QVariant>

#define FILM_DB_FILE "FilmDB.h"

class FilmDB
{
public:
    FilmDB(const QString& dbName);
    ~FilmDB();

    QList<QString> get_good_films_of_genre(int rating, const QString& genre);
    QList<QString> get_films_of_genre_less_than(int time, const QString& genre);
    QList<QString> get_films_less_than(int time);
    int count_genre(const QString& genre);

private:
    QSqlDatabase db;

    void initializeDatabase();
};

#endif // FILMDB_H
