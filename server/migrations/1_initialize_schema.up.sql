CREATE TABLE users (
    id bigserial PRIMARY KEY,
    username varchar UNIQUE NOT NULL,
    created_at timestamp without time zone NOT NULL default now(),
    updated_at timestamp without time zone NOT NULL default now()
);

CREATE TABLE drivers (
    id bigserial PRIMARY KEY,
    username varchar UNIQUE NOT NULL,
    vehicle_id varchar UNIQUE NOT NULL,
    created_at timestamp without time zone NOT NULL default now(),
    updated_at timestamp without time zone NOT NULL default now()
);

CREATE TABLE bids (
    id bigserial PRIMARY KEY,
    user_id bigint NOT NULL,
    metermele integer NOT NULL,
    driver_id bigint,
    otp varchar NOT NULL,
    from_lat decimal NOT NULL,
    from_lng decimal NOT NULL,
    from_address varchar NOT NULL,
    to_lat decimal NOT NULL,
    to_lng decimal NOT NULL,
    to_address varchar NOT NULL,
    created_at timestamp without time zone NOT NULL default now(),
    updated_at timestamp without time zone NOT NULL default now()
);
