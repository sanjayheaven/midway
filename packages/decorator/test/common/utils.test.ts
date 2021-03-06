import {
  saveProviderId,
  getProviderId,
  DUPLICATED_INJECTABLE_DECORATOR,
  getPropertyInject,
  Provide,
  Inject,
  getConstructorInject,
  attachConstructorDataOnClass,
  getClassMetadata,
  CLASS_KEY_CONSTRUCTOR,
  savePropertyInject,
  saveConstructorInject,
  saveObjectDefProps,
  getObjectDefProps,
} from '../../src';

@Provide()
class Test {
  constructor(@Inject('@testpackage') tt: any) {
    // ignore
  }

  @Inject('@testpackage')
  hello: any;
}

class TestOne {
  constructor(h1: any, h2: any) {
    // ignore
  }
}

describe('/test/common/util.test.ts', () => {
  it('util saveProviderId should be ok', () => {
    saveProviderId('test1', Test, true);
    const t = getProviderId(Test);
    expect(t).toEqual('test1');

    let s = '';
    try {
      saveProviderId('test2', Test);
    } catch (e) {
      s = e.message;
    }
    expect(s).toEqual(DUPLICATED_INJECTABLE_DECORATOR);
  });

  it('util savePropertyInject should be ok', () => {
    const p = getPropertyInject(Test);
    expect(p).toEqual({
      hello: [
        {
          args: undefined,
          key: 'inject',
          value: '@testpackage:hello',
        },
      ],
    });

    const c = getConstructorInject(Test);
    expect(c).toEqual({
      0: [
        {
          args: undefined,
          key: 'inject',
          value: '@testpackage:tt',
        },
      ],
    });

    let s = 'empty!';
    try {
      savePropertyInject({
        identifier: '@testpackage',
        target: Test,
        targetKey: 'hello',
      });
      savePropertyInject({
        identifier: '@testpackage',
        target: Test,
        targetKey: 'hello',
      });
    } catch (e) {
      s = e.message;
    }
    expect(s).not.toEqual('empty!');
    expect(s).toEqual('Metadata key was used more than once in a parameter: inject');

    s = 'empty1';
    try {
      saveConstructorInject({
        identifier: 'test',
        target: TestOne,
        targetKey: 'hello',
        index: 1,
      });
    } catch (e) {
      s = e.message;
    }
    expect(s).not.toEqual('empty1');
    expect(s).toEqual(
      'The @inject @multiInject @tagged and @named decorators must be applied to the parameters of a class constructor or a class property.'
    );
  });

  it('util attachConstructorDataOnClass shoule be ok', () => {
    attachConstructorDataOnClass('', TestOne, 'ttt', 0);

    const meta = getClassMetadata(CLASS_KEY_CONSTRUCTOR, TestOne);
    expect(meta).toStrictEqual({ 0: { key: 'h1', type: 'ttt' } });
  });

  it('util saveObjectDefProps should be ok', () => {
    saveObjectDefProps(TestOne);
    const tt = getObjectDefProps(TestOne);
    expect(tt).toStrictEqual({});
  });
});
