import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PlaceController::index
 * @see app/Http/Controllers/PlaceController.php:18
 * @route '/api/places'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/places',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PlaceController::index
 * @see app/Http/Controllers/PlaceController.php:18
 * @route '/api/places'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlaceController::index
 * @see app/Http/Controllers/PlaceController.php:18
 * @route '/api/places'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PlaceController::index
 * @see app/Http/Controllers/PlaceController.php:18
 * @route '/api/places'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PlaceController::index
 * @see app/Http/Controllers/PlaceController.php:18
 * @route '/api/places'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PlaceController::index
 * @see app/Http/Controllers/PlaceController.php:18
 * @route '/api/places'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PlaceController::index
 * @see app/Http/Controllers/PlaceController.php:18
 * @route '/api/places'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
const PlaceController = { index }

export default PlaceController