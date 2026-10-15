import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PlacePhotoController::index
 * @see app/Http/Controllers/PlacePhotoController.php:14
 * @route '/api/places/{place}/photos'
 */
export const index = (args: { place: string | { slug: string } } | [place: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/places/{place}/photos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PlacePhotoController::index
 * @see app/Http/Controllers/PlacePhotoController.php:14
 * @route '/api/places/{place}/photos'
 */
index.url = (args: { place: string | { slug: string } } | [place: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { place: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { place: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    place: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        place: typeof args.place === 'object'
                ? args.place.slug
                : args.place,
                }

    return index.definition.url
            .replace('{place}', parsedArgs.place.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlacePhotoController::index
 * @see app/Http/Controllers/PlacePhotoController.php:14
 * @route '/api/places/{place}/photos'
 */
index.get = (args: { place: string | { slug: string } } | [place: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PlacePhotoController::index
 * @see app/Http/Controllers/PlacePhotoController.php:14
 * @route '/api/places/{place}/photos'
 */
index.head = (args: { place: string | { slug: string } } | [place: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PlacePhotoController::index
 * @see app/Http/Controllers/PlacePhotoController.php:14
 * @route '/api/places/{place}/photos'
 */
    const indexForm = (args: { place: string | { slug: string } } | [place: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PlacePhotoController::index
 * @see app/Http/Controllers/PlacePhotoController.php:14
 * @route '/api/places/{place}/photos'
 */
        indexForm.get = (args: { place: string | { slug: string } } | [place: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PlacePhotoController::index
 * @see app/Http/Controllers/PlacePhotoController.php:14
 * @route '/api/places/{place}/photos'
 */
        indexForm.head = (args: { place: string | { slug: string } } | [place: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
const PlacePhotoController = { index }

export default PlacePhotoController