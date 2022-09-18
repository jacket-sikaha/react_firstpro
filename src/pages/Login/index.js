import { Card, Form, Checkbox, Button, Input, message } from "antd";
import logo from "@/assets/logo.jpg";
import "./index.scss";
import { useStore } from "@/store";
import { useNavigate } from "react-router-dom";
const Login = () => {
  // validateTrigger 校验时机

  const { loginStore } = useStore();
  const navigate = useNavigate();

  async function onFinish(val) {
    //async默认返回promise对象
    console.log("val", val);
    //val:  用户表单输入的所有信息
    //todo： 登录
    let { phone, passwd } = val;
    try {
      //使用await最好使用try catch包裹，防止接口报错导致页面崩溃
      await loginStore.getToken({ mobile: phone, code: passwd }); //等待异步完成再下一步
      message.success("登陆成功");
      navigate("/");
    } catch (error) {
      message.error("登陆失败");
    }
  }
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login">
      <Card className="login-container">
        <img className="login-logo" src={logo} alt="" />
        {/* 登录表单 */}
        <Form
          initialValues={{
            remember1: true,
            passwd: "246810",
            phone: "13811111111",
          }}
          validateTrigger="onBlur" //这里是统一处理
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="phone"
            rules={[
              {
                required: true,
                message: "请输入手机号!",
              },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: "请输入正确的手机号!",
              },
            ]}
          >
            <Input size="large" placeholder="请输入手机号" />
          </Form.Item>

          <Form.Item
            name="passwd"
            rules={[
              {
                required: true,
                message: "请输入验证码!",
              },
              {
                len: 6,
                message: "请输入6位验证码!",
              },
            ]}
          >
            <Input size="large" placeholder="请输入验证码" />
          </Form.Item>

          <Form.Item name="remember1" valuePropName="checked">
            <Checkbox className="login-checkbox-label">
              我已阅读并同意「用户协议」和「隐私条款」
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
