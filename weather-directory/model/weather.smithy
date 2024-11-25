$version: "2"
namespace example.weather

use aws.protocols#restJson1

@paginated(inputToken: "nextToken", outputToken: "nextToken", pageSize: "pageSize")
@restJson1
service Weather {
    version: "2006-03-01"
    resources: [City]
    operations: [GetCurrentTime]
}

resource City {
    identifiers: { cityId: CityId }
    properties: { coordinates: CityCoordinates }
    create: CreateCity 
    read: GetCity
    delete: DeleteCity
    list: ListCities
    resources: [
        Forecast
    ]
}

// "pattern" is a trait.
@pattern("^[A-Za-z0-9 ]+$")
string CityId

structure CityCoordinates {
    @required
    latitude: Float

    @required
    longitude: Float
}

resource Forecast {
    identifiers: { cityId: CityId }
    properties: { chanceOfRain: Float }
    read: GetForecast
}

@readonly
@http(method: "GET", uri: "/time", code: 200)
operation GetCurrentTime {
    output := {
        @required
        time: Timestamp
    }
}

@http(method: "POST", uri: "/city", code: 200)
operation CreateCity {
    input := for City {
        @required
        $coordinates
    }

    output := for City {
        @required
        $cityId
    }

    errors: [
      CityAlreadyExists
    ]

}

// "client" specifies that the client is at fault and not the server (i.e 400 vs 500)
@error("client")
structure CityAlreadyExists {
    @required
    collisionType: String
}

@readonly
@http(method: "GET", uri: "/city/{cityId}", code: 200)
operation GetCity {
    input := for City {
        // "cityId" provides the identifier for the resource and
        // has to be marked as required.
        @required
        @httpLabel
        $cityId
    }

    output := for City {
        // "required" is used on output to indicate if the service
        // will always provide a value for the member.
        // "notProperty" indicates that top-level input member "name"
        // is not bound to any resource property.
        @required
        @notProperty
        name: String

        @required
        $coordinates
    }

    errors: [
        NoSuchResource
    ]
}

@idempotent
@http(method: "DELETE", uri: "/city/{cityId}", code: 204)
operation DeleteCity {

    input := for City {
        @required
        @httpLabel
        $cityId
    }

    errors: [
        NoSuchResource,
        DeletionProtection
    ]
}

@error("client")
structure DeletionProtection {
}

// "error" is a trait that is used to specialize
// a structure as an error.
@error("client")
structure NoSuchResource {
    @required
    resourceType: String
}

@readonly
@http(method: "GET", uri: "/forecast/{cityId}", code: 200)
operation GetForecast {
    // "cityId" provides the only identifier for the resource since
    // a Forecast doesn't have its own.
    input := for Forecast {
        @required
        @httpLabel
        $cityId
    }

    output := for Forecast {
        $chanceOfRain
    }
}

// The paginated trait indicates that the operation may
// return truncated results. Applying this trait to the service
// sets default pagination configuration settings on each operation.
@readonly
@paginated(items: "items")
@http(method: "GET", uri: "/city/list", code: 200)
operation ListCities {
    input := {
        @httpQuery("nextToken")
        nextToken: String
        @httpQuery("pageSize")
        pageSize: Integer
    }

    output := {
        nextToken: String

        @required
        items: CitySummaries
    }
}

// CitySummaries is a list of CitySummary structures.
list CitySummaries {
    member: CitySummary
}

// CitySummary contains a reference to a City.
@references([
    {
        resource: City
    }
])
structure CitySummary {
    @required
    cityId: CityId

    @required
    name: String
}
