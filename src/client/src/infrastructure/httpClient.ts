import { Observable } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { ResponseContext } from '../models/httpResponse';

export class HttpClient {
    get<T>(url: string, headers: { [key: string]: string }): Observable<T> {
        return fromFetch(url, {
            method: 'GET',
            headers: headers
        }).pipe(this.handleResponse());
    }

    post<T>(url: string, headers: { [key: string]: string }, body: any): Observable<T> {
        return fromFetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        }).pipe(this.handleResponse());
    }

    put<T>(url: string, headers: { [key: string]: string }, body: any): Observable<T> {
        return fromFetch(url, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(body)
        }).pipe(this.handleResponse());
    }

    patch<T>(url: string, headers: { [key: string]: string }, body: any): Observable<T> {
        return fromFetch(url, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(body)
        }).pipe(this.handleResponse());
    }

    delete<T>(url: string, headers: { [key: string]: string }): Observable<T> {
        return fromFetch(url, {
            method: 'DELETE',
            headers: headers
        }).pipe(this.handleResponse());
    }

    request<T>(url: string, init: RequestInit): Observable<T> {
        return fromFetch(url, init).pipe(this.handleResponse());
    }

    private handleResponse<T>(): (source: Observable<Response>) => Observable<T> {
        return (source: Observable<Response>) => new Observable<T>(observer => {
            return source.subscribe({
                async next(response: Response) {
                    const contentType = response.headers.get('content-type') || '';

                    const context: ResponseContext = {
                        status: response.status,
                        data: undefined,
                        headers: response.headers,
                        ok: response.ok
                    };

                    if (contentType.startsWith('text/html')) {
                        context.ok = false;
                        observer.error(context);
                        return;
                    }

                    if (response.ok) {
                        if (response.status !== 204) {
                            const json = await response.json();
                            const data = json as T;
                            observer.next(data);
                        } else {
                            observer.next(true as unknown as T);
                        }
                    } else {
                        if (contentType.startsWith('application/json')) {
                            context.data = await response.json();
                        }

                        observer.error(context);
                    }
                }
            });
        });
    }
}
