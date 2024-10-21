#include "FilmDB.h"
#include <QDebug>

FilmDB::FilmDB(const QString& dbName)
{
    db = QSqlDatabase::addDatabase("QSQLITE");
    db.setDatabaseName(dbName);
    if (!db.open())
    {
        qDebug() << "Ошибка открытия базы данных:" << db.lastError().text();
    }
    initializeDatabase();
}

FilmDB::~FilmDB()
{
    QSqlQuery query(db);
    query.exec("DELETE FROM Films");
    db.close();
}

void FilmDB::initializeDatabase()
{
    QSqlQuery query(db);
    query.exec("CREATE TABLE IF NOT EXISTS Films ("
               "title VARCHAR(255) NOT NULL, "
               "genre VARCHAR(100) NOT NULL, "
               "rating INT NOT NULL, "
               "duration INT NOT NULL)");

    if (query.exec("SELECT COUNT(*) FROM Films") && query.next() && query.value(0).toInt() == 0)
    {
        query.exec("INSERT INTO Films (title, genre, rating, duration) VALUES "
                   "('Film A', 'Action', 8, 120), "
                   "('Film B', 'Drama', 9, 90), "
                   "('Film C', 'Action', 7, 110), "
                   "('Film D', 'Comedy', 6, 95), "
                   "('Film E', 'Drama', 10, 150)");
    }
}

QList<QString> FilmDB::get_good_films_of_genre(int rating, const QString& genre)
{
    QList<QString> films;
    QSqlQuery query(db);
    query.prepare("SELECT title FROM Films WHERE genre = :genre AND rating >= :rating");
    query.bindValue(":genre", genre);
    query.bindValue(":rating", rating);
    query.exec();

    while (query.next())
    {
        films.append(query.value(0).toString());
    }
    return films;
}

QList<QString> FilmDB::get_films_of_genre_less_than(int time, const QString& genre)
{
    QList<QString> films;
    QSqlQuery query(db);
    query.prepare("SELECT title FROM Films WHERE genre = :genre AND duration <= :time");
    query.bindValue(":genre", genre);
    query.bindValue(":time", time);
    query.exec();

    while (query.next())
    {
        films.append(query.value(0).toString());
    }
    return films;
}

QList<QString> FilmDB::get_films_less_than(int time)
{
    QList<QString> films;
    QSqlQuery query(db);
    query.prepare("SELECT title FROM Films WHERE duration <= :time");
    query.bindValue(":time", time);
    query.exec();

    while (query.next())
    {
        films.append(query.value(0).toString());
    }
    return films;
}

int FilmDB::count_genre(const QString& genre)
{
    QSqlQuery query(db);
    query.prepare("SELECT COUNT(*) FROM Films WHERE genre = :genre");
    query.bindValue(":genre", genre);
    query.exec();

    if (query.next()) {
        return query.value(0).toInt();
    }
    return 0;
}
