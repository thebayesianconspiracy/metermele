export const JOURNEYS = [{
  title: "Optimized for Time",
  journey: [
    {
      entity: {
        coordinate: {
          latitude: 12.931093,
          longitude: 77.628987,
        },
        type: "HOME",
        occupancy: "NONE",
        distance: 0.3,
        fare: 0,
        time: 15
      },
      route: [{
        latitude: 12.931093,
        longitude: 77.628987,
      }, {
        latitude: 12.991093,
        longitude: 77.828987,
      }],
      time: {
        coordinate: {
          latitude: 12.991093,
          longitude: 77.828987,
        },
        time: new Date()
      }
    },
    {
      entity: {
        coordinate: {
          latitude: 12.931093,
          longitude: 77.628987,
        },
        type: "BUS",
        occupancy: "LOW",
        distance: 4,
        fare: 20,
        time: 18
      },
      route: [{
        latitude: 12.931093,
        longitude: 77.628987,
      }, {
        latitude: 12.991093,
        longitude: 77.828987,
      }],
      time: {
        coordinate: {
          latitude: 12.991093,
          longitude: 77.828987,
        },
        time: new Date()
      }
    },
    {
      entity: {
        coordinate: {
          latitude: 12.931093,
          longitude: 77.628987,
        },
        type: "AUTO",
        occupancy: "NONE",
        distance: 2,
        fare: 26,
        time: 10
      },
      route: [{
        latitude: 12.931093,
        longitude: 77.628987,
      }, {
        latitude: 12.991093,
        longitude: 77.828987,
      }],
      time: {
        coordinate: {
          latitude: 12.991093,
          longitude: 77.828987,
        },
        time: new Date()
      }
    }
  ]
},
{
  title: "Optimized for Comfort",
  journey: [
    {
      entity: {
        coordinate: {
          latitude: 12.931093,
          longitude: 77.628987,
        },
        type: "PERSON",
        occupancy: "NONE",
        distance: 0.3,
        fare: 0,
        time: 15
      },
      route: [{
        latitude: 12.931093,
        longitude: 77.628987,
      }, {
        latitude: 12.991093,
        longitude: 77.828987,
      }],
      time: {
        coordinate: {
          latitude: 12.991093,
          longitude: 77.828987,
        },
        time: new Date()
      }
    },
    {
      entity: {
        coordinate: {
          latitude: 12.931093,
          longitude: 77.628987,
        },
        type: "BUS",
        occupancy: "LOW",
        distance: 4,
        fare: 20,
        time: 18
      },
      route: [{
        latitude: 12.931093,
        longitude: 77.628987,
      }, {
        latitude: 12.991093,
        longitude: 77.828987,
      }],
      time: {
        coordinate: {
          latitude: 12.991093,
          longitude: 77.828987,
        },
        time: new Date()
      }
    },
    {
      entity: {
        coordinate: {
          latitude: 12.931093,
          longitude: 77.628987,
        },
        type: "AUTO",
        occupancy: "NONE",
        distance: 2,
        fare: 26,
        time: 10
      },
      route: [{
        latitude: 12.931093,
        longitude: 77.628987,
      }, {
        latitude: 12.991093,
        longitude: 77.828987,
      }],
      time: {
        coordinate: {
          latitude: 12.991093,
          longitude: 77.828987,
        },
        time: new Date()
      }
    }
  ]
},
{
  title: "Optimized for Fare",
  journey: [
    {
      entity: {
        coordinate: {
          latitude: 12.931093,
          longitude: 77.628987,
        },
        type: "PERSON",
        occupancy: "NONE",
        distance: 0.3,
        fare: 0,
        time: 15
      },
      route: [{
        latitude: 12.931093,
        longitude: 77.628987,
      }, {
        latitude: 12.991093,
        longitude: 77.828987,
      }],
      time: {
        coordinate: {
          latitude: 12.991093,
          longitude: 77.828987,
        },
        time: new Date()
      }
    },
    {
      entity: {
        coordinate: {
          latitude: 12.931093,
          longitude: 77.628987,
        },
        type: "BUS",
        occupancy: "LOW",
        distance: 4,
        fare: 20,
        time: 18
      },
      route: [{
        latitude: 12.931093,
        longitude: 77.628987,
      }, {
        latitude: 12.991093,
        longitude: 77.828987,
      }],
      time: {
        coordinate: {
          latitude: 12.991093,
          longitude: 77.828987,
        },
        time: new Date()
      }
    },
    {
      entity: {
        coordinate: {
          latitude: 12.931093,
          longitude: 77.628987,
        },
        type: "AUTO",
        occupancy: "NONE",
        distance: 2,
        fare: 26,
        time: 10
      },
      route: [{
        latitude: 12.931093,
        longitude: 77.628987,
      }, {
        latitude: 12.991093,
        longitude: 77.828987,
      }],
      time: {
        coordinate: {
          latitude: 12.991093,
          longitude: 77.828987,
        },
        time: new Date()
      }
    }
  ]
}];


export const CURRRENT_JOURNEY = [{
  title: "Optimized for Time",
  journeyLegCurrentId: 1,
  journey: [
    {
      entity: {
        coordinate: {
          latitude: 12.931093,
          longitude: 77.628987,
        },
        type: "PERSON",
        occupancy: "NONE",
        distance: 0.3,
        fare: 0,
        time: 15,
        from: 'Yelachenahalli Metro Station Bangalore',
        to: 'Indiranagar Metro Station' 
      },
      route: [{
        latitude: 12.931093,
        longitude: 77.628987,
      }, {
        latitude: 12.991093,
        longitude: 77.828987,
      }],
      time: {
        coordinate: {
          latitude: 12.991093,
          longitude: 77.828987,
        },
        time: new Date()
      }
    },
    {
      entity: {
        coordinate: {
          latitude: 12.931093,
          longitude: 77.628987,
        },
        type: "BUS",
        occupancy: "LOW",
        distance: 4,
        fare: 20,
        time: 18,
        from: 'Yelachenahalli Metro Station Bangalore',
        to: 'Indiranagar Metro Station',
        busNo:'214E',
        vehicleNo:'KA05 E345'
      },
      route: [{
        latitude: 12.931093,
        longitude: 77.628987,
      }, {
        latitude: 12.991093,
        longitude: 77.828987,
      }],
      time: {
        coordinate: {
          latitude: 12.991093,
          longitude: 77.828987,
        },
        time: new Date()
      }
    },
    {
      entity: {
        coordinate: {
          latitude: 12.931093,
          longitude: 77.628987,
        },
        type: "AUTO",
        occupancy: "NONE",
        distance: 2,
        fare: 26,
        time: 10,
        from: 'Yelachenahalli Metro Station Bangalore',
        to: 'Indiranagar Metro Station',
        vehicleNo:'KA05 E345',
        driverName:'Pluto',
        OTP : '12345'
      },
      route: [{
        latitude: 12.931093,
        longitude: 77.628987,
      }, {
        latitude: 12.991093,
        longitude: 77.828987,
      }],
      time: {
        coordinate: {
          latitude: 12.991093,
          longitude: 77.828987,
        },
        time: new Date()
      }
    }
  ]
}];

