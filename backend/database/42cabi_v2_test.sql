create table ban_user
(
    ban_id       int auto_increment
        primary key,
    user_id      int         not null,
    intra_id     varchar(30) not null,
    cabinet_id   int         null,
    bannedDate   datetime    not null,
    unBannedDate datetime    null
);

create table cabinet
(
    cabinet_id  int auto_increment
        primary key,
    cabinet_num int                        not null,
    location    varchar(30)                not null,
    floor       int                        not null,
    section     varchar(30) charset latin1 not null,
    activation  tinyint                    not null
)
    collate = utf8_bin;

create table disable
(
    disable_id         int auto_increment
        primary key,
    disable_cabinet_id int                                     not null,
    disable_time       timestamp default current_timestamp()   not null,
    fix_time           timestamp default '0000-00-00 00:00:00' not null,
    status             tinyint   default 1                     null,
    note               text                                    null
)
    charset = utf8mb4;

create table event
(
    event_id   int auto_increment
        primary key,
    event_name varchar(100) null,
    intra_id   varchar(40)  null,
    isEvent    tinyint(1)   null
)
    collate = utf8_bin;

create table lent_log
(
    log_id         int auto_increment
        primary key,
    log_user_id    int      not null,
    log_cabinet_id int      not null,
    lent_time      datetime not null,
    return_time    datetime not null
)
    collate = utf8_bin;

create table user
(
    user_id    int          not null
        primary key,
    intra_id   varchar(30)  not null,
    auth       tinyint      not null,
    email      varchar(128) null,
    phone      varchar(128) null,
    firstLogin datetime     null,
    lastLogin  datetime     null
);

create table lent
(
    lent_id         int auto_increment
        primary key,
    lent_cabinet_id int      not null,
    lent_user_id    int      not null,
    lent_time       datetime not null,
    expire_time     date     not null,
    extension       tinyint  not null,
    constraint lent_cabinet_id_UNIQUE
        unique (lent_cabinet_id),
    constraint lent_user_id_UNIQUE
        unique (lent_user_id),
    constraint lent_cabinet_id
        foreign key (lent_cabinet_id) references cabinet (cabinet_id),
    constraint lent_user_id
        foreign key (lent_user_id) references user (user_id)
            on delete cascade
)
    collate = utf8_bin;

create index cabinet_id_idx
    on lent (lent_cabinet_id);

create index user_id_idx
    on lent (lent_user_id);

