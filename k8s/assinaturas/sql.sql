create table schema_migration
(
    version varchar(14) not null
);

alter table schema_migration
    owner to postgres;

create unique index schema_migration_version_idx
    on schema_migration (version);

create table plans
(
    id             uuid                 not null
        constraint plans_pkey
            primary key,
    name           varchar(255)         not null,
    description    text                 not null,
    price          numeric(6, 2)        not null,
    remote_plan_id varchar(255)         not null,
    recurrence     varchar(255)         not null,
    active         boolean default true not null,
    created_at     timestamp            not null,
    updated_at     timestamp            not null
);

alter table plans
    owner to postgres;

create table subscribers
(
    id              uuid         not null
        constraint subscribers_pkey
            primary key,
    name            varchar(255) not null,
    email           varchar(255) not null,
    document_number varchar(255) not null,
    street          varchar(255) not null,
    street_number   varchar(255) not null,
    complementary   varchar(255) not null,
    neighborhood    varchar(255) not null,
    zipcode         varchar(255) not null,
    ddd             varchar(255) not null,
    number          varchar(255) not null,
    created_at      timestamp    not null,
    updated_at      timestamp    not null
);

alter table subscribers
    owner to postgres;

create table subscriptions
(
    id                     uuid         not null
        constraint subscriptions_pkey
            primary key,
    subscriber_id          uuid         not null
        constraint fk_psubscriptions_subscribers
            references subscribers
            on update cascade on delete cascade,
    remote_subscription_id varchar(255) not null,
    remote_plan_id         varchar(255) not null,
    plan_id                uuid         not null
        constraint fk_psubscriptions_plans
            references plans
            on update cascade on delete cascade,
    start_date             date         not null,
    expires_at             date         not null,
    status                 varchar(255) not null,
    created_at             timestamp    not null,
    updated_at             timestamp    not null
);

alter table subscriptions
    owner to postgres;

create table payments
(
    id                     uuid         not null
        constraint payments_pkey
            primary key,
    transaction_id         varchar(255) not null,
    subscription_id        uuid         not null
        constraint fk_payments_subscriptions
            references subscriptions
            on update cascade on delete cascade,
    gateway                varchar(255) not null,
    payment_type           varchar(255) not null,
    card_brand             varchar(255) not null,
    card_last_digits       varchar(255) not null,
    boleto_url             varchar(255) not null,
    boleto_barcode         varchar(255) not null,
    boleto_expiration_date varchar(255) not null,
    status                 varchar(255) not null,
    total                  integer      not null,
    installments           integer      not null,
    created_at             timestamp    not null,
    updated_at             timestamp    not null
);

alter table payments
    owner to postgres;

INSERT INTO plans(id,name,description, price, remote_plan_id, recurrence, active, created_at, updated_at) VALUES('43eaca52-bd4c-11ea-b3de-0242ac130004','Plano exemplo','Descrição','1000','486868','Annual',true,current_timestamp,current_timestamp);
INSERT INTO plans(id,name,description, price, remote_plan_id, recurrence, active, created_at, updated_at) VALUES('6ac00aa0-a9be-4b64-8bbd-f5bb094bc081','Plano Semestral','Descrição','500','486868','Annual',true,current_timestamp,current_timestamp);