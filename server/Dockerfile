# Build Stage
FROM lacion/alpine-golang-buildimage:1.12.4 AS build-stage

LABEL app="build-vahana"
LABEL REPO="https://github.com/ppsreejith/vahana"

ENV PROJPATH=/go/src/github.com/ppsreejith/vahana

# Because of https://github.com/docker/docker/issues/14914
ENV PATH=$PATH:$GOROOT/bin:$GOPATH/bin

ADD . /go/src/github.com/ppsreejith/vahana
WORKDIR /go/src/github.com/ppsreejith/vahana

RUN make build-alpine

# Final Stage
FROM lacion/alpine-base-image:latest

ARG GIT_COMMIT
ARG VERSION
LABEL REPO="https://github.com/ppsreejith/vahana"
LABEL GIT_COMMIT=$GIT_COMMIT
LABEL VERSION=$VERSION

# Because of https://github.com/docker/docker/issues/14914
ENV PATH=$PATH:/opt/vahana/bin

WORKDIR /opt/vahana/bin

COPY --from=build-stage /go/src/github.com/ppsreejith/vahana/bin/vahana /opt/vahana/bin/
RUN chmod +x /opt/vahana/bin/vahana

# Create appuser
RUN adduser -D -g '' vahana
USER vahana

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD ["/opt/vahana/bin/vahana"]
