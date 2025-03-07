export function outputStream(): [WritableStream<string>, Promise<string>] {
  var output = "";
  var resolve: (output: string) => void;
  const stream: WritableStream<string> = new WritableStream<string>({
    start () {
      output = "";
    },
    write (chunk: string) {
      output += chunk;
    },
    close() {
      resolve(output);
    },
  });
  const promise = new Promise<string>(r => {
    resolve = r;
  });
  return [stream, promise];
}